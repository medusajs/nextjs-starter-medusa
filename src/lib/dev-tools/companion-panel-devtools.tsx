/**
 * Companion Panel Developer Tools
 * 
 * Provides debugging, testing, and development utilities for the companion panel system.
 * Only available in development mode.
 */

"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useCompanionPanel } from '../context/companion-panel-context'
import { PanelType } from '../types/panel-types'
import { config, getEnabledFeatures } from '../config/companion-config'

interface DevToolsState {
  isVisible: boolean
  activeTab: 'state' | 'actions' | 'performance' | 'testing'
  logs: LogEntry[]
}

interface LogEntry {
  id: string
  timestamp: number
  type: 'action' | 'state' | 'error' | 'performance'
  message: string
  data?: any
}

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
}

const CompanionPanelDevTools: React.FC = () => {
  const [devState, setDevState] = useState<DevToolsState>({
    isVisible: false,
    activeTab: 'state',
    logs: []
  })

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  
  const panelContext = useCompanionPanel()
  const {
    isOpen,
    currentPanel,
    panelHistory,
    isMobile,
    panelWidth,
    canGoBack,
    historyCount,
    chatSystem,
    openPanel,
    closePanel,
    goBack,
    clearHistory
  } = panelContext

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const addLog = useCallback((type: LogEntry['type'], message: string, data?: any) => {
    const logEntry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      message,
      data
    }

    setDevState(prev => ({
      ...prev,
      logs: [...prev.logs.slice(-99), logEntry] // Keep last 100 logs
    }))
  }, [])

  const recordPerformance = useCallback((name: string, startTime: number) => {
    const duration = performance.now() - startTime
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now()
    }

    setPerformanceMetrics(prev => [...prev.slice(-49), metric]) // Keep last 50 metrics
    addLog('performance', `${name}: ${duration.toFixed(2)}ms`, metric)
  }, [addLog])

  // Monitor panel state changes
  useEffect(() => {
    addLog('state', 'Panel state changed', {
      isOpen,
      currentPanel: currentPanel?.type,
      historyCount
    })
  }, [isOpen, currentPanel?.type, historyCount, addLog])

  // Performance monitoring wrapper
  const withPerformanceTracking = useCallback((actionName: string, action: () => void) => {
    return () => {
      const startTime = performance.now()
      addLog('action', `Starting: ${actionName}`)
      
      try {
        action()
        recordPerformance(actionName, startTime)
        addLog('action', `Completed: ${actionName}`)
      } catch (error) {
        addLog('error', `Error in ${actionName}: ${error.message}`, error)
      }
    }
  }, [addLog, recordPerformance])

  const testActions = {
    openCart: withPerformanceTracking('Open Cart', () => openPanel('cart', { test: true })),
    openFilter: withPerformanceTracking('Open Filter', () => openPanel('filter', { filters: {} })),
    openAI: withPerformanceTracking('Open AI', () => {
      if (config.featureFlags.aiCompanion) {
        openPanel('ai-assistant', { query: 'test' })
      } else {
        addLog('error', 'AI Companion is disabled in config')
      }
    }),
    closePanel: withPerformanceTracking('Close Panel', closePanel),
    goBack: withPerformanceTracking('Go Back', goBack),
    clearHistory: withPerformanceTracking('Clear History', clearHistory),
    stressTest: () => {
      addLog('action', 'Starting stress test...')
      const panels: PanelType[] = ['cart', 'filter']
      let i = 0
      
      const runTest = () => {
        if (i < 20) {
          const panelType = panels[i % panels.length]
          const startTime = performance.now()
          openPanel(panelType, { testIndex: i })
          recordPerformance(`stress-test-${i}`, startTime)
          i++
          setTimeout(runTest, 100)
        } else {
          addLog('action', 'Stress test completed')
        }
      }
      
      runTest()
    }
  }

  const clearLogs = () => {
    setDevState(prev => ({ ...prev, logs: [] }))
  }

  const clearMetrics = () => {
    setPerformanceMetrics([])
  }

  const exportData = () => {
    const data = {
      timestamp: Date.now(),
      panelState: {
        isOpen,
        currentPanel,
        panelHistory,
        isMobile,
        panelWidth,
        canGoBack,
        historyCount
      },
      chatSystem,
      logs: devState.logs,
      performanceMetrics,
      config
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `companion-panel-debug-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!devState.isVisible) {
    return (
      <button
        onClick={() => setDevState(prev => ({ ...prev, isVisible: true }))}
        className="fixed bottom-4 left-4 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg z-50 transition-colors"
        title="Open Companion Panel DevTools"
      >
        🛠️
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-96 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 text-white p-2 flex justify-between items-center">
        <h3 className="font-semibold text-sm">Companion Panel DevTools</h3>
        <button
          onClick={() => setDevState(prev => ({ ...prev, isVisible: false }))}
          className="text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {(['state', 'actions', 'performance', 'testing'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setDevState(prev => ({ ...prev, activeTab: tab }))}
            className={`flex-1 p-2 text-xs font-medium capitalize ${
              devState.activeTab === tab
                ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-3 max-h-80 overflow-y-auto text-xs">
        {/* State Tab */}
        {devState.activeTab === 'state' && (
          <div className="space-y-2">
            <div className="bg-gray-50 p-2 rounded">
              <h4 className="font-semibold mb-1">Panel State</h4>
              <div className="space-y-1">
                <div>Open: <span className={isOpen ? 'text-green-600' : 'text-red-600'}>{isOpen.toString()}</span></div>
                <div>Current: <span className="font-mono">{currentPanel?.type || 'none'}</span></div>
                <div>History: {historyCount}</div>
                <div>Mobile: <span className={isMobile ? 'text-blue-600' : 'text-gray-600'}>{isMobile.toString()}</span></div>
                <div>Width: {panelWidth}px</div>
                <div>Can Go Back: {canGoBack.toString()}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <h4 className="font-semibold mb-1">Configuration</h4>
              <div className="space-y-1">
                <div>Enabled Features: {getEnabledFeatures().map(f => f.key).join(', ')}</div>
                <div>Max History: {config.layoutOptions.maxPanelHistory}</div>
                <div>Debug Mode: {config.development.enableDebugMode.toString()}</div>
              </div>
            </div>

            {chatSystem && (
              <div className="bg-gray-50 p-2 rounded">
                <h4 className="font-semibold mb-1">Chat System</h4>
                <div className="space-y-1">
                  <div>Messages: {chatSystem.mainChat.messages.length}</div>
                  <div>Tickets: {chatSystem.tickets.length}</div>
                  <div>Active Ticket: {chatSystem.activeTicketId || 'none'}</div>
                  <div>View: {chatSystem.ticketView}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions Tab */}
        {devState.activeTab === 'actions' && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={testActions.openCart}
                className="bg-blue-500 text-white p-2 rounded text-xs hover:bg-blue-600"
              >
                Open Cart
              </button>
              <button
                onClick={testActions.openFilter}
                className="bg-green-500 text-white p-2 rounded text-xs hover:bg-green-600"
              >
                Open Filter
              </button>
              <button
                onClick={testActions.openAI}
                className="bg-purple-500 text-white p-2 rounded text-xs hover:bg-purple-600"
                disabled={!config.featureFlags.aiCompanion}
              >
                Open AI
              </button>
              <button
                onClick={testActions.closePanel}
                className="bg-red-500 text-white p-2 rounded text-xs hover:bg-red-600"
              >
                Close Panel
              </button>
              <button
                onClick={testActions.goBack}
                className="bg-gray-500 text-white p-2 rounded text-xs hover:bg-gray-600"
                disabled={!canGoBack}
              >
                Go Back
              </button>
              <button
                onClick={testActions.clearHistory}
                className="bg-orange-500 text-white p-2 rounded text-xs hover:bg-orange-600"
              >
                Clear History
              </button>
            </div>

            <div className="border-t pt-2">
              <h4 className="font-semibold mb-2">Utilities</h4>
              <div className="space-y-1">
                <button
                  onClick={exportData}
                  className="w-full bg-indigo-500 text-white p-2 rounded text-xs hover:bg-indigo-600"
                >
                  Export Debug Data
                </button>
                <button
                  onClick={clearLogs}
                  className="w-full bg-gray-500 text-white p-2 rounded text-xs hover:bg-gray-600"
                >
                  Clear Logs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {devState.activeTab === 'performance' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Performance Metrics</h4>
              <button
                onClick={clearMetrics}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>

            {performanceMetrics.length === 0 ? (
              <div className="text-gray-500 text-center py-4">
                No metrics recorded yet
              </div>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {performanceMetrics.slice(-10).reverse().map(metric => (
                  <div
                    key={`${metric.name}-${metric.timestamp}`}
                    className={`p-2 rounded text-xs ${
                      metric.duration > 100 
                        ? 'bg-red-50 text-red-800' 
                        : metric.duration > 50 
                        ? 'bg-yellow-50 text-yellow-800'
                        : 'bg-green-50 text-green-800'
                    }`}
                  >
                    <div className="font-mono">{metric.name}</div>
                    <div className="text-xs opacity-75">
                      {metric.duration.toFixed(2)}ms - {new Date(metric.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {performanceMetrics.length > 0 && (
              <div className="bg-gray-50 p-2 rounded">
                <h5 className="font-semibold mb-1">Summary</h5>
                <div className="text-xs space-y-1">
                  <div>
                    Avg: {(performanceMetrics.reduce((sum, m) => sum + m.duration, 0) / performanceMetrics.length).toFixed(2)}ms
                  </div>
                  <div>
                    Max: {Math.max(...performanceMetrics.map(m => m.duration)).toFixed(2)}ms
                  </div>
                  <div>
                    Min: {Math.min(...performanceMetrics.map(m => m.duration)).toFixed(2)}ms
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Testing Tab */}
        {devState.activeTab === 'testing' && (
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold mb-2">Automated Tests</h4>
              <button
                onClick={testActions.stressTest}
                className="w-full bg-red-500 text-white p-2 rounded text-xs hover:bg-red-600 mb-2"
              >
                Run Stress Test (20 operations)
              </button>
            </div>

            <div className="border-t pt-2">
              <h4 className="font-semibold mb-2">Activity Log</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">
                  {devState.logs.length} entries
                </span>
                <button
                  onClick={clearLogs}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {devState.logs.slice(-20).reverse().map(log => (
                  <div
                    key={log.id}
                    className={`p-1 rounded text-xs ${
                      log.type === 'error' 
                        ? 'bg-red-50 text-red-800'
                        : log.type === 'performance'
                        ? 'bg-blue-50 text-blue-800'
                        : log.type === 'action'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-mono">{log.type.toUpperCase()}</span>
                      <span className="text-xs opacity-75">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div>{log.message}</div>
                    {log.data && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-xs opacity-75">Data</summary>
                        <pre className="mt-1 text-xs bg-white p-1 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanionPanelDevTools