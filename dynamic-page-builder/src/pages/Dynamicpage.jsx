import React from 'react';
import { componentsList } from './ComponentsList';

const DynamicPage = ({ layout }) => {
  return (
    <div className="p-4">
      {layout.map((component, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: componentsList[component.type] }} />
      ))}
    </div>
  );
};

export default DynamicPage;
