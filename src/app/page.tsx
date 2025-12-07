"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaTrashAlt, FaNodeJs, FaInfoCircle, FaTree, FaCog, FaRedo, FaExclamationTriangle } from "react-icons/fa";
import { BTree } from "./lib/arvore-b";

export default function Home() {
  const [value, setValue] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [treeOrder, setTreeOrder] = useState(3);
  const [tree, setTree] = useState(new BTree(3));
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Reinicializa a árvore quando a ordem muda
  useEffect(() => {
    const newTree = new BTree(treeOrder);
    setTree(newTree);
    setOperationHistory(prev => [`Árvore reinicializada com ordem ${treeOrder}`, ...prev.slice(0, 4)]);
    setRefresh(prev => prev + 1);
  }, [treeOrder]);

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    show: { opacity: 1, scale: 1, y: 0 },
  };

  const addToHistory = (operation: string) => {
    setOperationHistory(prev => [operation, ...prev.slice(0, 4)]);
  };

  const resetTree = () => {
    setTree(new BTree(treeOrder));
    addToHistory("Árvore reinicializada");
    setRefresh(prev => prev + 1);
  };

  const renderNode = (node: any, depth = 0) => {
    if (!node) return null;
    
    const maxKeys = treeOrder - 1;
    const isFull = node.keys.length === maxKeys;
    const isNearFull = node.keys.length === maxKeys - 1;

    return (
      <motion.div
        variants={cardVariant}
        initial="hidden"
        animate="show"
        transition={{ 
          type: "spring", 
          stiffness: 120 - depth * 10, 
          damping: 12,
          delay: depth * 0.05
        }}
        className={`
          px-4 py-3 rounded-xl shadow-lg border-2 backdrop-blur-sm 
          hover:shadow-xl transition-all duration-300 relative
          ${
            isFull 
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-400 text-red-900' 
              : isNearFull
              ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-400 text-yellow-900'
              : depth === 0 
                ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 text-blue-900'
                : 'bg-white border-blue-200 text-blue-900'
          }
        `}
        style={{ marginLeft: depth > 0 ? '0.5rem' : '0' }}
      >
        {/* Indicador de estado do nó */}
        {isFull && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
            <FaExclamationTriangle className="text-xs" />
            CHEIO
          </div>
        )}
        
        {isNearFull && !isFull && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            QUASE CHEIO
          </div>
        )}

        {/* Cabeçalho do nó */}
        <div className={`text-center text-xs font-semibold mb-2 
                        flex items-center justify-between
                        ${isFull ? 'text-red-700' : isNearFull ? 'text-yellow-700' : 'text-blue-700'}`}>
          <div className="flex items-center gap-1">
            <FaNodeJs className={`text-sm ${isFull ? 'text-red-500' : isNearFull ? 'text-yellow-500' : 'text-blue-500'}`} />
            <span>Nó {node.leaf ? "(Folha)" : "(Interno)"}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isFull 
              ? 'bg-red-100 text-red-800' 
              : isNearFull
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {node.keys.length}/{maxKeys} chaves
          </span>
        </div>

        {/* Chaves */}
        <div className="flex flex-wrap gap-2 justify-center min-h-[2rem]">
          {node.keys.map((key: number, i: number) => (
            <motion.div
              key={`${key}-${i}`}
              initial={{ scale: 0, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1 + depth * 0.1 }}
              className={`
                px-3 py-2 rounded-lg text-white font-bold shadow-md border 
                min-w-[2.5rem] text-center relative
                ${
                  isFull
                    ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-700'
                    : isNearFull
                    ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-700'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-700'
                }
              `}
            >
              {key}
              {/* Indicador de posição */}
              <div className="absolute -bottom-1 -right-1 bg-blue-800 text-white 
                            text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filhos */}
        {!node.leaf && node.children && node.children.length > 0 && (
          <motion.div 
            className={`flex gap-4 justify-center mt-4 pt-3 ${
              isFull ? 'border-t border-red-200' : isNearFull ? 'border-t border-yellow-200' : 'border-t border-blue-100'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + depth * 0.1 }}
          >
            {node.children.map((child: any, i: number) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`text-xs mb-1 px-2 py-1 rounded-full ${
                  isFull ? 'bg-red-100 text-red-600' : isNearFull ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  Filho {i + 1}
                </div>
                {renderNode(child, depth + 1)}
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    );
  };

  const insertValue = () => {
    if (!value) return;
    const numValue = Number(value);
    tree.insert(numValue);
    addToHistory(`Inserido: ${numValue}`);
    setValue("");
    setRefresh(refresh + 1);
  };

  const removeValue = () => {
    if (!value) return;
    const numValue = Number(value);
    tree.remove(numValue);
    addToHistory(`Removido: ${numValue}`);
    setValue("");
    setRefresh(refresh + 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      insertValue();
    }
  };

  const generateSampleData = () => {
    resetTree();
    const sampleData = [10, 20, 5, 15, 25, 30, 35, 40, 45, 50, 55, 60];
    sampleData.forEach((num, index) => {
      setTimeout(() => {
        tree.insert(num);
        setRefresh(prev => prev + 1);
        if (index === sampleData.length - 1) {
          addToHistory("Dados de exemplo carregados");
        }
      }, index * 100);
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <FaTree className="text-3xl text-green-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Visualizador de Árvore B
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Ordem atual: {treeOrder} (máx. {treeOrder - 1} chaves por nó) • 
          {treeOrder % 2 === 0 ? " Ordem Par" : " Ordem Ímpar"}
        </p>
      </motion.header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Painel de Controle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Configurações */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-purple-300">
                <FaCog />
                Configurações
              </h2>
              <button
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="text-slate-400 hover:text-white transition"
              >
                {isConfigOpen ? "▲" : "▼"}
              </button>
            </div>

            <AnimatePresence>
              {isConfigOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Ordem da Árvore (Grau t)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="3"
                        max="7"
                        value={treeOrder}
                        onChange={(e) => setTreeOrder(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>3 (2 chaves)</span>
                        <span className="font-bold text-purple-300">{treeOrder} ({treeOrder - 1} chaves)</span>
                        <span>7 (6 chaves)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[3, 4, 5, 6, 7].map((order) => (
                      <button
                        key={order}
                        onClick={() => setTreeOrder(order)}
                        className={`px-2 py-1 rounded transition ${
                          treeOrder === order
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        Ordem {order}
                      </button>
                    ))}
                  </div>

                  <div className="text-sm text-slate-400 p-3 bg-slate-700 rounded-lg">
                    <strong>Ordem {treeOrder}:</strong> Máximo de {treeOrder - 1} chaves por nó
                    <br />
                    <strong>Mínimo:</strong> {Math.floor(treeOrder / 2)} chaves por nó (exceto raiz)
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={resetTree}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 
                               px-3 py-2 rounded-lg transition text-sm"
                    >
                      <FaRedo />
                      Reiniciar
                    </button>
                    <button
                      onClick={generateSampleData}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 px-3 py-2 rounded-lg 
                               transition text-sm font-semibold"
                    >
                      Exemplo
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Legenda dos Estados */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-300">
              <FaInfoCircle />
              Legenda
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-700">
                <div className="w-4 h-4 rounded bg-blue-400"></div>
                <span className="text-sm">Normal</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-700">
                <div className="w-4 h-4 rounded bg-yellow-400"></div>
                <span className="text-sm">Quase Cheio (1 espaço)</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-700">
                <div className="w-4 h-4 rounded bg-red-400"></div>
                <span className="text-sm">Cheio (Pronto para dividir)</span>
              </div>
            </div>
          </div>

          {/* Card de Operações */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-300">
              <FaPlusCircle />
              Operações
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Valor para inserir/remover
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 
                             text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                             focus:ring-cyan-500 focus:border-transparent transition"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite um número..."
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 
                             hover:from-green-600 hover:to-green-700 px-4 py-3 rounded-lg shadow-lg 
                             transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={insertValue}
                  disabled={!value}
                >
                  <FaPlusCircle />
                  Inserir
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 
                             hover:from-red-600 hover:to-red-700 px-4 py-3 rounded-lg shadow-lg 
                             transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={removeValue}
                  disabled={!value}
                >
                  <FaTrashAlt />
                  Remover
                </motion.button>
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-300">
              <FaInfoCircle />
              Histórico
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <AnimatePresence>
                {operationHistory.map((op, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="px-3 py-2 bg-slate-700 rounded-lg text-sm font-mono border-l-4 border-cyan-500"
                  >
                    {op}
                  </motion.div>
                ))}
              </AnimatePresence>
              {operationHistory.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-4">
                  Nenhuma operação realizada
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Visualização da Árvore */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-green-300">
                Visualização da Árvore
              </h2>
              <div className="text-sm text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
                Ordem {treeOrder} • Máximo {treeOrder - 1} chaves por nó
              </div>
            </div>
            
            <div className="min-h-[500px] flex items-center justify-center p-4 bg-slate-900/50 rounded-lg">
              <AnimatePresence mode="wait">
                {tree.root && tree.root.keys.length > 0 ? (
                  <motion.div
                    key={refresh}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full overflow-auto"
                  >
                    {renderNode(tree.root)}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center text-slate-400"
                  >
                    <FaTree className="text-6xl mx-auto mb-4 text-slate-600" />
                    <p className="text-lg">Árvore vazia</p>
                    <p className="text-sm mt-2">Insira valores ou use o botão "Exemplo"</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}