const IVRService = require('./ivr.service');
const IVRConsolidationModel = require('./ivr_consolidations.model');
const twilio = require('twilio');
const express = require('express');
const IVRNodesModel = require('./ivr_nodes.model');

const IVRController = {
  // Health check endpoint público
  async healthCheck(req, res, next) {
    try {
      res.json({
        success: true,
        message: 'Sistema IVR funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        endpoints: {
          flows: 'Gestión de flujos IVR',
          nodes: 'Gestión de nodos',
          calls: 'Gestión de llamadas',
          webhooks: 'Webhooks de Twilio'
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async iniciarLlamada(req, res, next) {
    try {
      const { numeroDestino, flowId, campaignId } = req.body;

      if (!numeroDestino) {
        return res.status(400).json({
          success: false,
          error: 'Falta el número de destino.'
        });
      }

      if (!flowId) {
        return res.status(400).json({
          success: false,
          error: 'Falta el ID del flujo IVR.'
        });
      }

      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        return res.status(500).json({
          success: false,
          error: 'Credenciales de Twilio no configuradas'
        });
      }

      if (!process.env.TWILIO_PHONE_NUMBER) {
        return res.status(500).json({
          success: false,
          error: 'Número de teléfono de Twilio no configurado'
        });
      }

      const flow = await IVRService.getFlowById(flowId);
      if (!flow) {
        return res.status(404).json({
          success: false,
          error: 'Flujo IVR no encontrado'
        });
      }

      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const webhookBaseUrl = process.env.NGROK_URL || process.env.BASE_URL;

      const callRecord = await IVRService.createCall({
        flow_id: flowId,
        campaign_id: campaignId,
        phone_number: numeroDestino,
        direction: 'outbound',
        status: 'initiated'
      });

      const call = await client.calls.create({
        to: numeroDestino,
        from: process.env.TWILIO_PHONE_NUMBER,
        url: `${webhookBaseUrl}/api/ivr/webhook/outbound?call_id=${callRecord.id}&flow_id=${flowId}`,
        statusCallback: `${webhookBaseUrl}/api/ivr/webhook/status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed']
      });

      await IVRService.updateCall(callRecord.id, {
        call_sid: call.sid
      });

      res.json({
        success: true,
        callSid: call.sid,
        callId: callRecord.id,
        status: call.status
      });
    } catch (error) {
      console.error('Error al iniciar llamada IVR:', error);

      let errorMessage = error.message;
      let errorDetails = error.code || 'UNKNOWN_ERROR';

      if (error.code === 21219) {
        errorMessage = 'El número de destino no está verificado. Para cuentas de prueba de Twilio, debes verificar los números antes de llamarlos.';
        errorDetails = {
          code: 21219,
          solution: 'Ve a https://console.twilio.com/us1/develop/phone-numbers/manage/verified para verificar el número',
          unverifiedNumber: req.body.numeroDestino
        };
      }

      if (error.code === 21215) {
        errorMessage = 'Permisos internacionales no habilitados para este país.';
        errorDetails = {
          code: 21215,
          solution: 'Ve a https://console.twilio.com/us1/develop/voice/settings/geo-permissions para habilitar el país'
        };
      }

      res.status(500).json({
        success: false,
        error: errorMessage,
        details: errorDetails
      });
    }
  },
  async createFlow(req, res, next) {
    try {
      const { name, description, campaign_id, is_active } = req.body;
      const user_id = req.user?.id;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'El nombre del flujo es requerido'
        });
      }

      const flow = await IVRService.createFlow({
        name,
        description,
        campaign_id,
        user_id,
        is_active
      });

      res.status(201).json({
        success: true,
        message: 'Flujo IVR creado exitosamente',
        data: flow
      });
    } catch (error) {
      next(error);
    }
  },

  async getFlows(req, res, next) {
    try {
      const { campaign_id, user_id, is_active } = req.query;

      const flows = await IVRService.getFlows({
        campaign_id,
        user_id,
        is_active: is_active !== undefined ? is_active === 'true' : undefined
      });

      res.json({
        success: true,
        data: flows
      });
    } catch (error) {
      next(error);
    }
  },

  async getFlowById(req, res, next) {
    try {
      const { id } = req.params;

      const flow = await IVRService.getFlowById(id);

      if (!flow) {
        return res.status(404).json({
          success: false,
          message: 'Flujo no encontrado'
        });
      }

      res.json({
        success: true,
        data: flow
      });
    } catch (error) {
      next(error);
    }
  },

  async getFlowWithNodes(req, res, next) {
    try {
      const { id } = req.params;

      const flow = await IVRService.getFlowWithNodes(id);

      if (!flow) {
        return res.status(404).json({
          success: false,
          message: 'Flujo no encontrado'
        });
      }

      res.json({
        success: true,
        data: flow
      });
    } catch (error) {
      next(error);
    }
  },

  async updateFlow(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const flow = await IVRService.updateFlow(id, updates);

      if (!flow) {
        return res.status(404).json({
          success: false,
          message: 'Flujo no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Flujo actualizado exitosamente',
        data: flow
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteFlow(req, res, next) {
    try {
      const { id } = req.params;

      const flow = await IVRService.deleteFlow(id);

      if (!flow) {
        return res.status(404).json({
          success: false,
          message: 'Flujo no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Flujo eliminado exitosamente',
        data: flow
      });
    } catch (error) {
      next(error);
    }
  },

  async createNode(req, res, next) {
    try {
      const nodeData = req.body;

      if (!nodeData.flow_id || !nodeData.node_type || !nodeData.node_name) {
        return res.status(400).json({
          success: false,
          message: 'flow_id, node_type y node_name son requeridos'
        });
      }

      const node = await IVRService.createNode(nodeData);

      res.status(201).json({
        success: true,
        message: 'Nodo creado exitosamente',
        data: node
      });
    } catch (error) {
      next(error);
    }
  },

  async getNodesByFlowId(req, res, next) {
    try {
      const { flowId } = req.params;

      const nodes = await IVRService.getNodesByFlowId(flowId);

      res.json({
        success: true,
        data: nodes
      });
    } catch (error) {
      next(error);
    }
  },

  async getNodeById(req, res, next) {
    try {
      const { id } = req.params;

      const node = await IVRService.getNodeById(id);

      if (!node) {
        return res.status(404).json({
          success: false,
          message: 'Nodo no encontrado'
        });
      }

      res.json({
        success: true,
        data: node
      });
    } catch (error) {
      next(error);
    }
  },

  async updateNode(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const node = await IVRService.updateNode(id, updates);

      if (!node) {
        return res.status(404).json({
          success: false,
          message: 'Nodo no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Nodo actualizado exitosamente',
        data: node
      });
    } catch (error) {
      next(error);
    }
  },

  async bulkUpdateNodes(req, res, next) {
    try {
      const { nodes } = req.body;

      if (!Array.isArray(nodes) || nodes.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere un array de nodos'
        });
      }

      const updatedNodes = await IVRService.bulkUpdateNodes(nodes);

      res.json({
        success: true,
        message: 'Nodos actualizados exitosamente',
        data: updatedNodes
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteNode(req, res, next) {
    try {
      const { id } = req.params;

      const node = await IVRService.deleteNode(id);

      if (!node) {
        return res.status(404).json({
          success: false,
          message: 'Nodo no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Nodo eliminado exitosamente',
        data: node
      });
    } catch (error) {
      next(error);
    }
  },

  async getCalls(req, res, next) {
    try {
      const { flow_id, campaign_id, status, phone_number, date_from, date_to, limit } = req.query;

      const calls = await IVRService.getCalls({
        flow_id,
        campaign_id,
        status,
        phone_number,
        date_from,
        date_to,
        limit: limit ? parseInt(limit) : undefined
      });

      res.json({
        success: true,
        data: calls
      });
    } catch (error) {
      next(error);
    }
  },

  async getCallById(req, res, next) {
    try {
      const { id } = req.params;

      const call = await IVRService.getCallById(id);

      if (!call) {
        return res.status(404).json({
          success: false,
          message: 'Llamada no encontrada'
        });
      }

      res.json({
        success: true,
        data: call
      });
    } catch (error) {
      next(error);
    }
  },

  async getCallInteractions(req, res, next) {
    try {
      const { id } = req.params;

      const interactions = await IVRService.getCallInteractions(id);

      res.json({
        success: true,
        data: interactions
      });
    } catch (error) {
      next(error);
    }
  },

  async getCallStats(req, res, next) {
    try {
      const { flow_id, campaign_id, date_from, date_to } = req.query;

      const stats = await IVRService.getCallStats({
        flow_id,
        campaign_id,
        date_from,
        date_to
      });

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // NUEVAS FUNCIONES PARA MANEJO DE LLAMADAS
  async createCall(req, res, next) {
    try {
      const callData = req.body;
      const call = await IVRService.createCall(callData);
      
      res.status(201).json({
        success: true,
        message: 'Llamada creada exitosamente',
        data: call
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCallStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const call = await IVRService.updateCall(id, { status });
      
      res.json({
        success: true,
        message: 'Estado de llamada actualizado',
        data: call
      });
    } catch (error) {
      next(error);
    }
  },

  async iniciarLlamada(req, res, next) {
    try {
      const { numeroDestino, flowId } = req.body;
      
      if (!numeroDestino || !flowId) {
        return res.status(400).json({
          success: false,
          error: 'numeroDestino y flowId son requeridos'
        });
      }

      // Crear registro de llamada
      const call = await IVRService.createCall({
        flow_id: flowId,
        phone_number: numeroDestino,
        call_sid: `MANUAL_${Date.now()}`,
        direction: 'outbound',
        status: 'initiated'
      });

      // Si tienes Twilio configurado, también hacer la llamada real
      if (process.env.TWILIO_ACCOUNT_SID) {
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        const twilioCall = await client.calls.create({
          to: numeroDestino,
          from: process.env.TWILIO_PHONE_NUMBER,
          url: `${process.env.BASE_URL}/api/ivr/webhook/incoming?flow_id=${flowId}&call_id=${call.id}`
        });

        await IVRService.updateCall(call.id, {
          call_sid: twilioCall.sid,
          status: 'calling'
        });
      }

      res.json({
        success: true,
        message: 'Llamada IVR iniciada',
        data: call
      });
    } catch (error) {
      next(error);
    }
  },

  // Webhook principal para flujos IVR
  async handleWebhook(req, res, next) {
    try {
      const { flowId } = req.params;
      const { CallSid, From, To, CallStatus } = req.body;

      console.log('Webhook IVR recibido:', { flowId, CallSid, From, To, CallStatus });

      // Crear o obtener registro de llamada
      let call = await IVRService.getCallByCallSid(CallSid);
      
      if (!call) {
        call = await IVRService.createCall({
          flow_id: flowId,
          phone_number: From,
          call_sid: CallSid,
          direction: 'inbound',
          status: 'in_progress'
        });
      }

      // Obtener nodo inicial del flujo
      const initialNode = await IVRService.getInitialNode(flowId);

      if (!initialNode) {
        return res.status(400).type('text/xml').send(`
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Mia" language="es-MX">Lo sentimos, el flujo no está configurado correctamente.</Say>
            <Hangup/>
          </Response>
        `);
      }

      // Ejecutar nodo inicial
      const nodeResponse = await IVRService.executeNode(initialNode.id, null, {});

      // Registrar interacción
      await IVRService.logCallInteraction(call.id, {
        node_id: initialNode.id,
        node_type: initialNode.node_type,
        user_input: null,
        system_response: JSON.stringify(nodeResponse)
      });

      // Generar TwiML
      const twiml = this.generateTwiML(nodeResponse, call.id, flowId);

      res.type('text/xml').send(twiml);
    } catch (error) {
      console.error('Error en webhook principal:', error);
      res.status(500).type('text/xml').send(`
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Mia" language="es-MX">Lo sentimos, ha ocurrido un error.</Say>
          <Hangup/>
        </Response>
      `);
    }
  },

  // Manejo de entrada del usuario
  async handleUserInput(req, res, next) {
    try {
      const { flowId } = req.params;
      const { CallSid, Digits, SpeechResult } = req.body;
      const { nodeId, callId } = req.query;

      console.log('Input de usuario:', { flowId, CallSid, Digits, SpeechResult, nodeId, callId });

      const userInput = Digits || SpeechResult;

      // Obtener llamada
      let call = await IVRService.getCallByCallSid(CallSid);
      if (!call) {
        call = await IVRService.getCallById(callId);
      }

      if (!call) {
        return res.status(400).type('text/xml').send(`
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Mia" language="es-MX">Error en la sesión.</Say>
            <Hangup/>
          </Response>
        `);
      }

      // Obtener nodo actual
      const currentNode = await IVRService.getNodeById(nodeId);
      if (!currentNode) {
        return res.status(400).type('text/xml').send(`
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Mia" language="es-MX">Nodo no encontrado.</Say>
            <Hangup/>
          </Response>
        `);
      }

      // Registrar interacción del usuario
      await IVRService.logCallInteraction(call.id, {
        node_id: currentNode.id,
        node_type: currentNode.node_type,
        user_input: userInput,
        system_response: `Usuario ingresó: ${userInput}`
      });

      // Determinar siguiente nodo
      const connections = typeof currentNode.connections === 'string' 
        ? JSON.parse(currentNode.connections) 
        : currentNode.connections;

      const nextNodeId = connections?.[userInput] || connections?.default;

      if (!nextNodeId) {
        return res.type('text/xml').send(`
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Mia" language="es-MX">Opción no válida. Por favor intente de nuevo.</Say>
            <Redirect method="POST">/api/ivr/webhook/${flowId}?callId=${call.id}&nodeId=${currentNode.id}</Redirect>
          </Response>
        `);
      }

      // Ejecutar siguiente nodo
      const nextNode = await IVRService.getNodeById(nextNodeId);
      const nodeResponse = await IVRService.executeNode(nextNodeId, userInput, { userInput });

      // Registrar respuesta del sistema
      await IVRService.logCallInteraction(call.id, {
        node_id: nextNodeId,
        node_type: nextNode.node_type,
        user_input: null,
        system_response: JSON.stringify(nodeResponse)
      });

      // Generar TwiML
      const twiml = this.generateTwiML(nodeResponse, call.id, flowId);

      res.type('text/xml').send(twiml);
    } catch (error) {
      console.error('Error procesando input de usuario:', error);
      res.status(500).type('text/xml').send(`
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Mia" language="es-MX">Ha ocurrido un error procesando su respuesta.</Say>
          <Hangup/>
        </Response>
      `);
    }
  },

  async handleIncomingCall(req, res, next) {
    try {
      const { CallSid, From, To, CallStatus } = req.body;
      const { flow_id } = req.query;

      const call = await IVRService.createCall({
        flow_id,
        phone_number: From,
        call_sid: CallSid,
        direction: 'inbound',
        status: 'initiated'
      });

      const initialNode = await IVRService.getInitialNode(flow_id);

      if (!initialNode) {
        return res.status(400).type('text/xml').send(`
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Mia" language="es-MX">Lo sentimos, el flujo no está configurado correctamente.</Say>
            <Hangup/>
          </Response>
        `);
      }

      const nodeResponse = await IVRService.executeNode(initialNode.id, null, {});

      const twiml = this.generateTwiML(nodeResponse, call.id);

      res.type('text/xml').send(twiml);
    } catch (error) {
      console.error('Error en webhook incoming:', error);
      res.status(500).type('text/xml').send(`
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Mia" language="es-MX">Lo sentimos, ha ocurrido un error.</Say>
          <Hangup/>
        </Response>
      `);
    }
  },

  async handleOutboundCall(req, res, next) {
    try {
      const { call_id, flow_id } = req.query;

      await IVRService.updateCall(call_id, {
        status: 'answered'
      });

      const initialNode = await IVRService.getInitialNode(flow_id);

      if (!initialNode) {
        return res.status(400).type('text/xml').send(`
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Mia" language="es-MX">Lo sentimos, el flujo no está configurado correctamente.</Say>
            <Hangup/>
          </Response>
        `);
      }

      const nodeResponse = await IVRService.executeNode(initialNode.id, null, {});

      const twiml = this.generateTwiML(nodeResponse, call_id);

      res.type('text/xml').send(twiml);
    } catch (error) {
      console.error('Error en webhook outbound:', error);
      res.status(500).type('text/xml').send(`
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Mia" language="es-MX">Lo sentimos, ha ocurrido un error.</Say>
          <Hangup/>
        </Response>
      `);
    }
  },

  async handleGatherInput(req, res, next) {
    try {
      const { CallSid, Digits, SpeechResult } = req.body;
      const { call_id, node_id } = req.query;

      const userInput = Digits || SpeechResult;

      await IVRService.updateCall(call_id, {
        status: 'in_progress'
      });

      await IVRService.logCallInteraction(call_id, {
        node_id,
        node_type: 'input',
        user_input: userInput,
        system_response: null
      });

      const node = await IVRService.getNodeById(node_id);
      const connections = typeof node.connections === 'string' 
        ? JSON.parse(node.connections) 
        : node.connections;

      const nextNodeId = connections?.[userInput] || connections?.default;

      if (!nextNodeId) {
        return res.type('text/xml').send(`
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Mia" language="es-MX">Opción no válida.</Say>
            <Hangup/>
          </Response>
        `);
      }

      const nodeResponse = await IVRService.executeNode(nextNodeId, userInput, {});

      const twiml = this.generateTwiML(nodeResponse, call_id);

      res.type('text/xml').send(twiml);
    } catch (error) {
      console.error('Error en webhook gather:', error);
      res.status(500).type('text/xml').send(`
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Mia" language="es-MX">Lo sentimos, ha ocurrido un error.</Say>
          <Hangup/>
        </Response>
      `);
    }
  },

  async handleCallStatus(req, res, next) {
    try {
      const { CallSid, CallStatus, CallDuration } = req.body;

      const call = await IVRService.getCallByCallSid(CallSid);

      if (call) {
        await IVRService.updateCall(call.id, {
          status: CallStatus,
          duration: CallDuration ? parseInt(CallDuration) : null,
          ended_at: ['completed', 'failed', 'no-answer', 'busy'].includes(CallStatus) 
            ? new Date() 
            : null
        });

        // CONSOLIDAR DATOS AL FINALIZAR LA LLAMADA
        if (['completed', 'failed', 'no-answer', 'busy'].includes(CallStatus)) {
          await this.consolidateCallData(call.id);
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error en webhook status:', error);
      res.status(500).send('Error');
    }
  },

  // NUEVA FUNCIÓN: CONSOLIDAR DATOS DE LA LLAMADA
  async consolidateCallData(callId) {
    try {
      const interactions = await IVRService.getCallInteractions(callId);
      
      const consolidatedData = {
        call_id: callId,
        responses: {},
        voice_recordings: [],
        completed_at: new Date(),
        status: 'finalized'
      };

      // Procesar todas las interacciones
      interactions.forEach(interaction => {
        if (interaction.user_input) {
          consolidatedData.responses[`node_${interaction.node_id}`] = {
            type: interaction.node_type,
            response: interaction.user_input,
            timestamp: interaction.created_at
          };
        }
        
        if (interaction.recording_url) {
          consolidatedData.voice_recordings.push({
            node_id: interaction.node_id,
            url: interaction.recording_url,
            transcript: interaction.user_input,
            timestamp: interaction.created_at
          });
        }
      });

      // Guardar registro consolidado
      const consolidationQuery = `
        INSERT INTO ivr_call_consolidations (call_id, consolidated_data, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (call_id) 
        DO UPDATE SET 
          consolidated_data = $2, 
          status = $3, 
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      
      await pool.query(consolidationQuery, [
        callId, 
        JSON.stringify(consolidatedData),
        'finalized'
      ]);

      console.log('✅ Datos consolidados para llamada:', callId);
      
    } catch (error) {
      console.error('Error consolidando datos:', error);
    }
  },

  generateTwiML(nodeResponse, callId, flowId = null) {
    let twiml = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n';

    const webhookBaseUrl = process.env.NGROK_URL || process.env.BASE_URL;

    for (const action of nodeResponse.actions) {
      switch (action.action) {
        case 'say':
          twiml += `  <Say voice="Polly.Mia" language="${action.voice || 'es-MX'}">${action.message}</Say>\n`;
          break;

        case 'gather':
          let gatherUrl;
          if (flowId) {
            gatherUrl = `${webhookBaseUrl}/api/ivr/webhook/${flowId}/input?callId=${callId}&nodeId=${nodeResponse.nodeId}`;
          } else {
            gatherUrl = `${webhookBaseUrl}/api/ivr/webhook/gather?call_id=${callId}&node_id=${nodeResponse.nodeId}`;
          }
          twiml += `  <Gather numDigits="${action.numDigits || 1}" timeout="${action.timeout || 5}" action="${gatherUrl}" method="POST">\n`;
          twiml += `    <Say voice="Polly.Mia" language="es-MX">${action.message}</Say>\n`;
          twiml += `  </Gather>\n`;
          break;

        case 'play':
          twiml += `  <Play>${action.url}</Play>\n`;
          break;

        case 'dial':
          twiml += `  <Dial timeout="${action.timeout || 30}">${action.number}</Dial>\n`;
          break;

        case 'hangup':
          twiml += `  <Hangup/>\n`;
          break;

        default:
          break;
      }
    }

    twiml += '</Response>';
    return twiml;
  },

  // Funciones de consolidación
  async getConsolidations(req, res, next) {
    try {
      const filters = req.query;
      const consolidations = await IVRService.getConsolidations(filters);
      
      res.json({
        success: true,
        data: consolidations
      });
    } catch (error) {
      next(error);
    }
  },

  async getConsolidationByCallId(req, res, next) {
    try {
      const { callId } = req.params;
      const consolidation = await IVRService.getConsolidationByCallId(callId);
      
      if (!consolidation) {
        return res.status(404).json({ 
          success: false,
          message: 'Consolidación no encontrada' 
        });
      }
      
      res.json({
        success: true,
        data: consolidation
      });
    } catch (error) {
      next(error);
    }
  },

  async getConsolidationStats(req, res, next) {
    try {
      const filters = req.query;
      const stats = await IVRService.getConsolidationStats(filters);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  async getCollectedDataByField(req, res, next) {
    try {
      const { fieldName } = req.params;
      const filters = req.query;
      const data = await IVRService.getCollectedDataByField(fieldName, filters);
      
      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      next(error);
    }
  },

  // Rutas para nodos de IVR
  async createNode(req, res, next) {
    try {
      const nodeData = req.body;
      const newNode = await IVRNodesModel.createNode(nodeData);
      res.status(201).json(newNode);
    } catch (error) {
      console.error('Error creating IVR node:', error);
      res.status(500).json({ error: 'Failed to create IVR node' });
    }
  },

  async updateNode(req, res, next) {
    try {
      const nodeId = req.params.id;
      const nodeData = req.body;
      const updatedNode = await IVRNodesModel.updateNode(nodeId, nodeData);
      res.status(200).json(updatedNode);
    } catch (error) {
      console.error('Error updating IVR node:', error);
      res.status(500).json({ error: 'Failed to update IVR node' });
    }
  },

  async getNodeById(req, res, next) {
    try {
      const nodeId = req.params.id;
      const node = await IVRNodesModel.getNodeById(nodeId);
      res.status(200).json(node);
    } catch (error) {
      console.error('Error fetching IVR node:', error);
      res.status(500).json({ error: 'Failed to fetch IVR node' });
    }
  },

  async getNodesByFlowId(req, res, next) {
    try {
      const flowId = req.params.flowId;
      const nodes = await IVRNodesModel.getNodesByFlowId(flowId);
      res.status(200).json(nodes);
    } catch (error) {
      console.error('Error fetching IVR nodes:', error);
      res.status(500).json({ error: 'Failed to fetch IVR nodes' });
    }
  }
};

module.exports = IVRController;
