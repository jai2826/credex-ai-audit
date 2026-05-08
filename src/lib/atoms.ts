import { atomWithStorage } from 'jotai/utils';
import type { AuditInput, CurrencyType } from './types';

// The global list of tools the user is auditing
export const auditItemsAtom = atomWithStorage<AuditInput[]>('audit-items', []);

// Preferred currency for the entire report
export const currencyAtom = atomWithStorage<CurrencyType>('preferred-currency', 'USD');