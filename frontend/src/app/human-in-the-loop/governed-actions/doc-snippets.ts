/**
 * The page's server-side snippet, kept exact from
 * https://docs.copilotkit.ai/strands/human-in-the-loop/governed-actions
 * ("On resume ...") and shown as text on the route. It is TypeScript for a
 * backend, but this repo's backend is Python, and it calls `executeSideEffect`,
 * which no page defines. `agents/hitl_agents.py` ports the same check to Python.
 */

export const HANDLE_APPROVAL_SNIPPET = "type ApprovalResponse = {\n  approved: boolean;\n  actionId: string;\n  reference: string;\n};\n\nasync function handleApproval(action: GovernedAction, response: ApprovalResponse) {\n  if (\n    response.approved &&\n    response.actionId === action.id &&\n    response.reference === action.reference\n  ) {\n    return executeSideEffect(action.tool, action.arguments);\n  }\n\n  return {\n    skipped: true,\n    reason: \"The user did not approve this action.\",\n  };\n}\n";
