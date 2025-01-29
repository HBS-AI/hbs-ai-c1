import React from "react";
import {
  X,
  CaretUp,
  CaretDown,
  Plus,
  Globe,
  Browser,
  File,
  Code,
} from "@phosphor-icons/react";
import StartNode from "../nodes/StartNode";
import ApiCallNode from "../nodes/ApiCallNode";
import WebsiteNode from "../nodes/WebsiteNode";
import FileNode from "../nodes/FileNode";
import CodeNode from "../nodes/CodeNode";

const BLOCK_TYPES = {
  START: "start",
  API_CALL: "apiCall",
  WEBSITE: "website",
  FILE: "file",
  CODE: "code",
};

const BLOCK_INFO = {
  [BLOCK_TYPES.START]: {
    label: "Agent Start",
    icon: <Plus className="w-5 h-5 text-theme-text-primary" />,
    description: "Configure agent variables and settings",
    getSummary: (config) => {
      const varCount = config.variables?.filter((v) => v.name)?.length || 0;
      return `${varCount} variable${varCount !== 1 ? "s" : ""} defined`;
    },
  },
  [BLOCK_TYPES.API_CALL]: {
    label: "API Call",
    icon: <Globe className="w-5 h-5 text-theme-text-primary" />,
    description: "Make an HTTP request",
    defaultConfig: {
      url: "",
      method: "GET",
      headers: {},
      body: "",
      responseVariable: "",
    },
    getSummary: (config) =>
      `${config.method || "GET"} ${config.url || "(no URL)"}`,
  },
  [BLOCK_TYPES.WEBSITE]: {
    label: "Open Website",
    icon: <Browser className="w-5 h-5 text-theme-text-primary" />,
    description: "Navigate to a URL",
    defaultConfig: {
      url: "",
      selector: "",
      action: "read",
      value: "",
      resultVariable: "",
    },
    getSummary: (config) =>
      `${config.action || "read"} from ${config.url || "(no URL)"}`,
  },
  [BLOCK_TYPES.FILE]: {
    label: "Open File",
    icon: <File className="w-5 h-5 text-theme-text-primary" />,
    description: "Read or write to a file",
    defaultConfig: {
      path: "",
      operation: "read",
      content: "",
      resultVariable: "",
    },
    getSummary: (config) =>
      `${config.operation || "read"} ${config.path || "(no path)"}`,
  },
  [BLOCK_TYPES.CODE]: {
    label: "Code Execution",
    icon: <Code className="w-5 h-5 text-theme-text-primary" />,
    description: "Execute code snippets",
    defaultConfig: {
      language: "javascript",
      code: "",
      resultVariable: "",
    },
    getSummary: (config) => `Run ${config.language || "javascript"} code`,
  },
};

export default function BlockList({
  blocks,
  updateBlockConfig,
  removeBlock,
  toggleBlockExpansion,
  renderVariableSelect,
  onDeleteVariable,
}) {
  const renderBlockConfig = (block) => {
    const props = {
      config: block.config,
      onConfigChange: (config) => updateBlockConfig(block.id, config),
      renderVariableSelect,
      onDeleteVariable,
    };

    switch (block.type) {
      case BLOCK_TYPES.START:
        return <StartNode {...props} />;
      case BLOCK_TYPES.API_CALL:
        return <ApiCallNode {...props} />;
      case BLOCK_TYPES.WEBSITE:
        return <WebsiteNode {...props} />;
      case BLOCK_TYPES.FILE:
        return <FileNode {...props} />;
      case BLOCK_TYPES.CODE:
        return <CodeNode {...props} />;
      default:
        return <div>Configuration options coming soon...</div>;
    }
  };

  return (
    <div className="space-y-1">
      {blocks.map((block, index) => (
        <div key={block.id} className="flex flex-col">
          <div
            className={`bg-theme-action-menu-bg border border-white/10 rounded-lg overflow-hidden transition-all duration-300 ${
              block.isExpanded ? "w-full" : "w-[280px] mx-auto"
            }`}
          >
            <button
              onClick={() => toggleBlockExpansion(block.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-theme-action-menu-item-hover transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  {React.cloneElement(BLOCK_INFO[block.type].icon, {
                    className: "w-4 h-4 text-white"
                  })}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className="text-sm font-medium text-white block">
                    {BLOCK_INFO[block.type].label}
                  </span>
                  {!block.isExpanded && (
                    <p className="text-xs text-white/60 truncate">
                      {BLOCK_INFO[block.type].getSummary(block.config)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {block.id !== "start" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBlock(block.id);
                    }}
                    className="p-1 text-white/60 opacity-0 group-hover:opacity-100 hover:text-red-500 rounded transition-all duration-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="w-4 flex items-center justify-center">
                  {block.isExpanded ? (
                    <CaretUp className="w-3.5 h-3.5 text-white/60" />
                  ) : (
                    <CaretDown className="w-3.5 h-3.5 text-white/60" />
                  )}
                </div>
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                block.isExpanded
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-white/10 p-4 bg-theme-bg-secondary">
                {renderBlockConfig(block)}
              </div>
            </div>
          </div>
          {index < blocks.length - 1 && (
            <div className="flex justify-center my-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white/40"
              >
                <path
                  d="M12 4L12 20M12 20L6 14M12 20L18 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export { BLOCK_TYPES, BLOCK_INFO };
