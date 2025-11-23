import React, { useState, useEffect } from 'react';
import { X, Save, Key } from 'lucide-react';
import { useStore } from '../store/useStore';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { apiKeys, setApiKeys } = useStore();
    const [fmpKey, setFmpKey] = useState('');
    const [geminiKey, setGeminiKey] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFmpKey(apiKeys.fmp);
            setGeminiKey(apiKeys.gemini);
        }
    }, [isOpen, apiKeys]);

    const handleSave = () => {
        setApiKeys({ fmp: fmpKey, gemini: geminiKey });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#202124] border border-[#3c4043] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#3c4043]">
                    <h2 className="text-lg font-medium text-white flex items-center gap-2">
                        <Key size={20} className="text-[#8ab4f8]" />
                        Impostazioni API
                    </h2>
                    <button onClick={onClose} className="text-[#bdc1c6] hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-[#bdc1c6] uppercase tracking-wider">
                            Financial Modeling Prep API Key
                        </label>
                        <input
                            type="password"
                            value={fmpKey}
                            onChange={(e) => setFmpKey(e.target.value)}
                            placeholder="Inserisci la tua chiave FMP..."
                            className="w-full bg-[#303134] border border-[#3c4043] rounded-lg px-4 py-3 text-sm text-white focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] outline-none transition-all"
                        />
                        <p className="text-[10px] text-[#bdc1c6]">
                            Necessaria per i dati di mercato in tempo reale.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-[#bdc1c6] uppercase tracking-wider">
                            Google Gemini API Key
                        </label>
                        <input
                            type="password"
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                            placeholder="Inserisci la tua chiave Gemini..."
                            className="w-full bg-[#303134] border border-[#3c4043] rounded-lg px-4 py-3 text-sm text-white focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] outline-none transition-all"
                        />
                        <p className="text-[10px] text-[#bdc1c6]">
                            Necessaria per l'analisi AI e la chat.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#303134]/50 border-t border-[#3c4043] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-[#bdc1c6] hover:text-white transition-colors"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] font-medium rounded-full transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Save size={16} />
                        Salva Chiavi
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SettingsModal;
