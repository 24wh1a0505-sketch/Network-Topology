import { NetworkTopology } from '../types/network';

// Baseline 4-router syllabus topology
export const SYLLABUS_4_ROUTER_TOPOLOGY: NetworkTopology = {
  nodes: [
    { id: 'R1', name: 'Router 1 (R1)', x: 120, y: 220 },
    { id: 'R2', name: 'Router 2 (R2)', x: 340, y: 80 },
    { id: 'R3', name: 'Router 3 (R3)', x: 520, y: 220 },
    { id: 'R4', name: 'Router 4 (R4)', x: 340, y: 360 },
  ],
  edges: [
    { id: 'e-r1-r2', source: 'R1', destination: 'R2', cost: 4, bandwidthMbps: 100, delayMs: 15 },
    { id: 'e-r1-r3', source: 'R1', destination: 'R3', cost: 3, bandwidthMbps: 100, delayMs: 10 },
    { id: 'e-r1-r4', source: 'R1', destination: 'R4', cost: 6, bandwidthMbps: 50, delayMs: 25 },
    { id: 'e-r2-r3', source: 'R2', destination: 'R3', cost: 2, bandwidthMbps: 100, delayMs: 8 },
    { id: 'e-r3-r4', source: 'R3', destination: 'R4', cost: 1, bandwidthMbps: 100, delayMs: 5 },
  ],
};

// 6-Router Enterprise Mesh topology
export const ENTERPRISE_6_ROUTER_TOPOLOGY: NetworkTopology = {
  nodes: [
    { id: 'R1', name: 'Router 1 (R1)', x: 100, y: 140 },
    { id: 'R2', name: 'Router 2 (R2)', x: 300, y: 80 },
    { id: 'R3', name: 'Router 3 (R3)', x: 500, y: 140 },
    { id: 'R4', name: 'Router 4 (R4)', x: 100, y: 320 },
    { id: 'R5', name: 'Router 5 (R5)', x: 300, y: 380 },
    { id: 'R6', name: 'Router 6 (R6)', x: 500, y: 320 },
  ],
  edges: [
    { id: 'e-r1-r2', source: 'R1', destination: 'R2', cost: 2, bandwidthMbps: 100, delayMs: 10 },
    { id: 'e-r1-r4', source: 'R1', destination: 'R4', cost: 5, bandwidthMbps: 100, delayMs: 20 },
    { id: 'e-r2-r3', source: 'R2', destination: 'R3', cost: 3, bandwidthMbps: 100, delayMs: 12 },
    { id: 'e-r2-r5', source: 'R2', destination: 'R5', cost: 4, bandwidthMbps: 100, delayMs: 16 },
    { id: 'e-r3-r6', source: 'R3', destination: 'R6', cost: 2, bandwidthMbps: 100, delayMs: 8 },
    { id: 'e-r4-r5', source: 'R4', destination: 'R5', cost: 1, bandwidthMbps: 100, delayMs: 5 },
    { id: 'e-r5-r6', source: 'R5', destination: 'R6', cost: 2, bandwidthMbps: 100, delayMs: 7 },
  ],
};

// Ring topology with cross link
export const RING_5_ROUTER_TOPOLOGY: NetworkTopology = {
  nodes: [
    { id: 'R1', name: 'Router 1 (R1)', x: 300, y: 70 },
    { id: 'R2', name: 'Router 2 (R2)', x: 520, y: 170 },
    { id: 'R3', name: 'Router 3 (R3)', x: 440, y: 370 },
    { id: 'R4', name: 'Router 4 (R4)', x: 160, y: 370 },
    { id: 'R5', name: 'Router 5 (R5)', x: 80, y: 170 },
  ],
  edges: [
    { id: 'e-r1-r2', source: 'R1', destination: 'R2', cost: 3, bandwidthMbps: 100, delayMs: 12 },
    { id: 'e-r2-r3', source: 'R2', destination: 'R3', cost: 4, bandwidthMbps: 100, delayMs: 15 },
    { id: 'e-r3-r4', source: 'R3', destination: 'R4', cost: 2, bandwidthMbps: 100, delayMs: 8 },
    { id: 'e-r4-r5', source: 'R4', destination: 'R5', cost: 5, bandwidthMbps: 100, delayMs: 20 },
    { id: 'e-r5-r1', source: 'R5', destination: 'R1', cost: 3, bandwidthMbps: 100, delayMs: 10 },
    { id: 'e-r1-r3', source: 'R1', destination: 'R3', cost: 6, bandwidthMbps: 50, delayMs: 25 },
  ],
};

/**
 * Converts a NetworkTopology object into standard XML format as required by the CN Lab syllabus.
 */
export function topologyToXml(topology: NetworkTopology): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<network>\n`;
  xml += `    <!-- Router Nodes -->\n`;
  topology.nodes.forEach((node) => {
    xml += `    <router id="${node.id}" name="${node.name}" x="${Math.round(node.x)}" y="${Math.round(node.y)}"/>\n`;
  });
  xml += `\n    <!-- Network Connections (Undirected Links with Metric Cost) -->\n`;
  topology.edges.forEach((edge) => {
    xml += `    <connection>\n`;
    xml += `        <source>${edge.source}</source>\n`;
    xml += `        <destination>${edge.destination}</destination>\n`;
    xml += `        <cost>${edge.cost}</cost>\n`;
    if (edge.bandwidthMbps) {
      xml += `        <bandwidth>${edge.bandwidthMbps}Mbps</bandwidth>\n`;
    }
    xml += `    </connection>\n`;
  });
  xml += `</network>`;
  return xml;
}

/**
 * Parses XML string into NetworkTopology object with error checking.
 */
export function xmlToTopology(xmlString: string): { topology: NetworkTopology | null; error: string | null } {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      return { topology: null, error: `XML Parsing Error: ${parserError.textContent?.slice(0, 150)}` };
    }

    const networkEl = xmlDoc.querySelector('network');
    if (!networkEl) {
      return { topology: null, error: 'Root <network> element not found in XML.' };
    }

    const routerEls = xmlDoc.querySelectorAll('router');
    const connectionEls = xmlDoc.querySelectorAll('connection');

    if (routerEls.length === 0) {
      return { topology: null, error: 'No <router> elements defined in XML.' };
    }

    const nodes: NetworkTopology['nodes'] = [];
    const nodeIds = new Set<string>();

    routerEls.forEach((el, index) => {
      const id = el.getAttribute('id') || `R${index + 1}`;
      const name = el.getAttribute('name') || `Router ${id}`;
      const xAttr = el.getAttribute('x');
      const yAttr = el.getAttribute('y');

      // Default layout if coordinates omitted
      const angle = (index / routerEls.length) * 2 * Math.PI;
      const defaultX = 300 + Math.cos(angle) * 160;
      const defaultY = 220 + Math.sin(angle) * 120;

      const x = xAttr ? parseFloat(xAttr) : defaultX;
      const y = yAttr ? parseFloat(yAttr) : defaultY;

      nodes.push({ id, name, x, y });
      nodeIds.add(id);
    });

    const edges: NetworkTopology['edges'] = [];
    connectionEls.forEach((el, index) => {
      const source = el.querySelector('source')?.textContent?.trim() || '';
      const destination = el.querySelector('destination')?.textContent?.trim() || '';
      const costStr = el.querySelector('cost')?.textContent?.trim() || '1';
      const cost = Math.max(1, parseInt(costStr, 10) || 1);
      const bandwidthStr = el.querySelector('bandwidth')?.textContent?.trim();
      const bandwidthMbps = bandwidthStr ? parseInt(bandwidthStr, 10) || 100 : 100;

      if (!source || !destination) {
        return;
      }
      if (!nodeIds.has(source) || !nodeIds.has(destination)) {
        return;
      }

      edges.push({
        id: `e-${source.toLowerCase()}-${destination.toLowerCase()}-${index}`,
        source,
        destination,
        cost,
        bandwidthMbps,
        delayMs: cost * 4,
      });
    });

    return { topology: { nodes, edges }, error: null };
  } catch (err: any) {
    return { topology: null, error: `Exception parsing XML: ${err.message}` };
  }
}
