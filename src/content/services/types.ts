// A church service as a list of blocks, so the reader can style each kind and build a section index.
export type ServiceBlock =
  | { kind: "heading"; text: string } // a part of the service; listed in "Go to"
  | { kind: "subheading"; text: string } // a smaller label, such as a Tone or an Ode's canon
  | { kind: "rubric"; text: string } // an instruction, not prayed aloud
  | { kind: "refrain"; text: string } // a repeated response, such as "Lord, have mercy"
  | { kind: "verse"; text: string } // poetry with line breaks; lines starting with two spaces are indented
  | { kind: "text"; text: string; who?: string }; // a prayer or reading, optionally with who says it

export type ServiceText = { blocks: ServiceBlock[] };
