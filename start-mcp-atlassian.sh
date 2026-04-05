#!/bin/bash

if [[ -n "$TERM_PROGRAM" && "$TERM_PROGRAM" == "vscode" && -z "$FORCE_STDIO_RUN" ]]; then
	echo "Do not run this stdio MCP server directly in a normal VS Code terminal."
	echo "Use .vscode/mcp.json + 'MCP: List Servers' / auto-start instead."
	echo "If you really need a manual run for debugging, start with FORCE_STDIO_RUN=1 ./start-mcp-atlassian.sh"
	exit 1
fi

export TOOLSETS=all
/opt/homebrew/bin/uvx mcp-atlassian --env-file "/Users/Uladzislau_Baranouski/Github Copilot/Autotests_Creator/PICASso/.env"
