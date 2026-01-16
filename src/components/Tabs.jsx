import React from 'react'

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-dark-tertiary overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-4 font-semibold whitespace-nowrap transition-smooth border-b-2 ${
            activeTab === tab.id
              ? 'border-white text-text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
