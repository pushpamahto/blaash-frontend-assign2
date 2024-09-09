import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import axios from "axios";
import { SortableItem } from "./components/sortableItem";
import { componentsList } from "./components/componentsList";

const App = () => {
  const [components, setComponents] = useState([]);
  const [loadedLayout, setLoadedLayout] = useState([]);

  useEffect(() => {
    // Load the saved layout if exists
    axios.get("http://localhost:3001/layout")
      .then((response) => setLoadedLayout(response.data.components))
      .catch((err) => console.error(err));
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveLayout = () => {
    axios.post("http://localhost:3001/layout", { components })
      .then((response) => alert("Layout Saved!"))
      .catch((err) => console.error(err));
  };

  const loadLayout = () => {
    setComponents(loadedLayout);
  };

  const publishLayout = () => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write("<html><head><title>Published Layout</title></head><body>");
    components.forEach((component) => {
      newWindow.document.write(componentsList[component.type]);
    });
    newWindow.document.write("</body></html>");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <button onClick={saveLayout} className="bg-blue-500 text-white px-4 py-2 rounded">Save Layout</button>
        <button onClick={loadLayout} className="bg-green-500 text-white px-4 py-2 rounded">Load Layout</button>
        <button onClick={publishLayout} className="bg-red-500 text-white px-4 py-2 rounded">Publish Layout</button>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={components} strategy={verticalListSortingStrategy}>
          <div className="border rounded-lg p-4">
            {components.map((component) => (
              <SortableItem key={component.id} id={component.id} component={component} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default App;
