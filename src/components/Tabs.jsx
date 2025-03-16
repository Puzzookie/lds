import React, { useState } from 'react';

function Tabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Tab 1', content: 'Content for Tab 1' },
    { label: 'Tab 2', content: 'Content for Tab 2' },
    { label: 'Tab 3', content: 'Content for Tab 3' },
  ];

  return (
    <div>
      <ul className="flex flex-wrap border-b">
        {tabs.map((tab, index) => (
          <li key={index} className="-mb-px mr-2 last:mr-0">
            <button
              className={`inline-block py-2 px-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 text-white ${activeTab === index ? 'border-blue-500' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="py-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

export default Tabs;