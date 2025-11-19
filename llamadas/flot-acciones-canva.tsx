import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Action {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  description?: string;
}

interface ModalAccionesCanvaProps {
  show: boolean;
  onClose: () => void;
  actions: Record<string, Action[]>;
  sectionIcons: Record<string, React.ReactNode>;
  onSelectAction: (action: Action) => void;
  floating?: boolean;
}

const ModalAccionesCanva: React.FC<ModalAccionesCanvaProps> = ({ show, onClose, actions, sectionIcons, onSelectAction, floating }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Generales: false,
    Interactivas: false,
    Derivaciones: false,
    Servicios: false,
  });

  const handleSectionToggle = (section: string) => {
    setExpandedSections((prev: Record<string, boolean>) => {
      const updated: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = key === section ? !prev[section] : false;
      });
      return updated;
    });
  };

  if (!show) return null;
  return floating ? (
    <div className="bg-white rounded-xl shadow-xl p-4 w-80 border border-blue-100" style={{ zIndex: 999 }}>
      <button className="absolute top-2 right-2 text-gray-400 text-2xl" onClick={onClose}>&times;</button>
      <div className="p-2 border-b border-gray-200 bg-white flex-shrink-0">
        <p className="text-sm text-gray-500">Selecciona una acción para agregar</p>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[40vh]">
        {Object.entries(actions).map(([section, items]) => (
          <div key={section} className="border-b border-gray-100">
            <button
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-gray-800 font-medium transition-colors"
              onClick={() => handleSectionToggle(section)}
            >
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center">{sectionIcons[section]}</span>
                <span className="text-base">{section}</span>
              </span>
              <span className="text-gray-400">
                {expandedSections[section] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            {expandedSections[section] && (
              <div className="px-4 pb-2">
                {items.map((action) => (
                  <button
                    key={action.id}
                    className="flex items-center gap-2 w-full py-2 px-2 rounded hover:bg-blue-50 text-gray-700"
                    onClick={() => onSelectAction(action)}
                  >
                    <span className="w-6 h-6 flex items-center justify-center">{action.icon}</span>
                    <span className="text-sm">{action.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 bg-[rgba(30,32,40,0.35)] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full relative">
        <button className="absolute top-4 right-4 text-gray-400 text-2xl" onClick={onClose}>&times;</button>
        <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <p className="text-sm text-gray-500">Arrastra las acciones al canvas para construir tu flujo</p>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {Object.entries(actions).map(([section, items]) => (
            <div key={section} className="border-b border-gray-100">
              <button
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-gray-800 font-medium transition-colors"
                onClick={() => handleSectionToggle(section)}
              >
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center">{sectionIcons[section]}</span>
                  <span className="text-base">{section}</span>
                </span>
                <span className="text-gray-400">
                  {expandedSections[section] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>
              {expandedSections[section] && (
                <div className="bg-gray-50 px-6 py-3">
                  <div className="flex flex-col gap-3">
                    {items.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white border transition-all cursor-pointer hover:shadow-md border-gray-200 hover:border-blue-300"
                        onClick={() => onSelectAction(action)}
                        style={{ alignItems: "center", minHeight: 64 }}
                      >
                        <span className="flex items-center justify-center rounded-full border border-gray-300 bg-gray-50" style={{ width: 48, height: 48 }}>
                          {action.icon}
                        </span>
                        <span className="text-gray-900 font-semibold text-base">{action.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalAccionesCanva;
