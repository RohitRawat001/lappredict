import type { Laptop, AggregatedData } from './types';

// Helper: clean numeric strings (e.g., "1.37kg" -> 1.37, "₹50,000" -> 50000)
const cleanNumber = (val: string): number => {
  if (!val) return 0;
  const clean = val.replace(/[^0-9.-]+/g, '');
  return parseFloat(clean) || 0;
};

// ---------------- CSV Parsing ----------------
export const parseCSV = (csvText: string): Laptop[] => {
  if (!csvText) return [];

  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  // Parse header: remove BOM, quotes, trim, lowercase
  const headerRow = lines[0]
    .replace(/^\uFEFF/, '') // remove BOM
    .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    .map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
  // DO NOT filter empty headers → preserves column alignment

  // Map required fields to their column index
  const map: Record<string, number> = {
    company: headerRow.findIndex(h => h.includes('company') || h.includes('brand') || h.includes('manufacturer')),
    typeName: headerRow.findIndex(h => h.includes('typename') || h.includes('type') || h.includes('model')),
    inches: headerRow.findIndex(h => h.includes('inch') || h.includes('size')),
    screenResolution: headerRow.findIndex(h => h.includes('screenresolution') || h.includes('resolution') || h.includes('display')),
    cpu: headerRow.findIndex(h => h.includes('cpu') || h.includes('processor')),
    ram: headerRow.findIndex(h => h.includes('ram') || h.includes('memory')),
    memory: headerRow.findIndex(h => h.includes('memory') || h.includes('storage') || h.includes('hdd') || h.includes('ssd')),
    gpu: headerRow.findIndex(h => h.includes('gpu') || h.includes('graphics')),
    opSys: headerRow.findIndex(h => h.includes('opsys') || h.includes('os') || h.includes('operating')),
    weight: headerRow.findIndex(h => h.includes('weight') || h.includes('kg')),
    price: headerRow.findIndex(h => h.includes('price') || h.includes('mrp') || h.includes('cost') || h.includes('amount'))
  };

  // Ensure critical columns exist
  if (map.company === -1 || map.price === -1) {
    console.error("CSV Parse Error: Could not find 'Company' or 'Price' columns.", headerRow);
    return [];
  }

  const laptops: Laptop[] = [];

  // Parse each data row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma, ignoring commas inside quotes
    const row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map(cell => cell.replace(/^"|"$/g, '').trim());

    try {
      const laptop: Laptop = {
        id: i,
        company: map.company >= 0 ? row[map.company] || 'Unknown' : 'Unknown',
        typeName: map.typeName >= 0 ? row[map.typeName] || 'Unknown' : 'Unknown',
        inches: map.inches >= 0 ? parseFloat(row[map.inches] || '0') : 0,
        screenResolution: map.screenResolution >= 0 ? row[map.screenResolution] || '' : '',
        cpu: map.cpu >= 0 ? row[map.cpu] || '' : '',
        ram: map.ram >= 0 ? cleanNumber(row[map.ram]) : 0,
        memory: map.memory >= 0 ? row[map.memory] || '' : '',
        gpu: map.gpu >= 0 ? row[map.gpu] || '' : '',
        opSys: map.opSys >= 0 ? row[map.opSys] || '' : '',
        weight: map.weight >= 0 ? cleanNumber(row[map.weight]) : 0,
        price: map.price >= 0 ? cleanNumber(row[map.price]) : 0
      };

      if (laptop.price > 0) laptops.push(laptop);

    } catch (e) {
      console.warn(`Failed to parse row ${i}:`, row);
    }
  }

  console.log(`Parsed ${laptops.length} laptops successfully.`);
  return laptops;
};

// ---------------- Currency Formatter ----------------
export const formatCurrency = (value: number) => {
  if (isNaN(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// ---------------- Average Price by Company ----------------
export const getAveragePriceByCompany = (data: Laptop[]): AggregatedData[] => {
  if (!data || data.length === 0) return [];

  const companyTotals: Record<string, { sum: number; count: number }> = {};
  
  data.forEach(l => {
    if (!companyTotals[l.company]) companyTotals[l.company] = { sum: 0, count: 0 };
    companyTotals[l.company].sum += l.price;
    companyTotals[l.company].count += 1;
  });

  return Object.keys(companyTotals).map(company => ({
    label: company,
    value: Math.round(companyTotals[company].sum / companyTotals[company].count),
    count: companyTotals[company].count
  })).sort((a, b) => b.value - a.value);
};

// ---------------- RAM Distribution ----------------
export const getRamDistribution = (data: Laptop[]): AggregatedData[] => {
  if (!data || data.length === 0) return [];

  const ramCounts: Record<number, number> = {};
  
  data.forEach(l => {
    const ram = l.ram || 0;
    ramCounts[ram] = (ramCounts[ram] || 0) + 1;
  });

  return Object.keys(ramCounts).map(ram => ({
    label: `${ram}GB`,
    value: ramCounts[parseInt(ram)],
  })).sort((a, b) => parseInt(a.label) - parseInt(b.label));
};

// ---------------- General Stats ----------------
export const getStats = (data: Laptop[]) => {
  if (!data || data.length === 0) {
    return {
      totalLaptops: 0,
      avgPrice: 0,
      mostPopularBrand: 'N/A',
      mostExpensive: null
    };
  }

  const totalLaptops = data.length;
  const avgPrice = data.reduce((acc, curr) => acc + curr.price, 0) / totalLaptops;

  const companyCounts: Record<string, number> = {};
  data.forEach(l => companyCounts[l.company] = (companyCounts[l.company] || 0) + 1);

  const keys = Object.keys(companyCounts);
  const mostPopularBrand = keys.length > 0 
    ? keys.reduce((a, b) => companyCounts[a] > companyCounts[b] ? a : b)
    : 'N/A';

  const maxPrice = Math.max(...data.map(l => l.price));
  const mostExpensive = data.find(l => l.price === maxPrice) || null;

  return {
    totalLaptops,
    avgPrice,
    mostPopularBrand,
    mostExpensive
  };
};
