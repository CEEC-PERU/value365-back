const IVRService = require('./ivr.service');
const twilio = require('twilio');

const IVRController = {
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
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error en webhook status:', error);
      res.status(500).send('Error');
    }
  },

  generateTwiML(nodeResponse, callId) {
    let twiml = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n';

    const webhookBaseUrl = process.env.NGROK_URL || process.env.BASE_URL;

    for (const action of nodeResponse.actions) {
      switch (action.action) {
        case 'say':
          twiml += `  <Say voice="Polly.Mia" language="${action.voice || 'es-MX'}">${action.message}</Say>\n`;
          break;

        case 'gather':
          const gatherUrl = `${webhookBaseUrl}/api/ivr/webhook/gather?call_id=${callId}&node_id=${nodeResponse.nodeId}`;
          twiml += `  <Gather numDigits="${action.numDigits || 1}" timeout="${action.timeout || 5}" action="${gatherUrl}" language="es-MX" input="dtmf speech">\n`;
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
  }
};

module.exports = IVRController;
