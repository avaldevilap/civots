import { z } from 'zod';

export type DNSDomain = z.infer<typeof DNSDomainSchema>;
export type DNSRecord = z.infer<typeof DNSRecordSchema>;
export type DNSDomainConfig = z.infer<typeof DNSDomainConfigSchema>;
export type DNSRecordType = z.infer<typeof DNSRecordTypeSchema>;
export type DNSRecordConfig = z.infer<typeof DNSRecordConfigSchema>;

// DNSDomain represents a domain registered within Civo's infrastructure
export const DNSDomainSchema = z.object({
  // The ID of the domain
  id: z.string(),

  // The ID of the account
  account_id: z.string(),

  // The Name of the domain
  name: z.string(),
});

export const DNSDomainConfigSchema = z.object({
  name: z.string(),
});

// DNSRecordType represents the allowed record types: a, cname, mx or txt
export const DNSRecordTypeSchema = z.enum(['a', 'cname', 'mx', 'txt']);

// DNSRecord represents a DNS record registered within Civo's infrastructure
export const DNSRecordSchema = z.object({
  id: z.string(),
  account_id: z.string().optional(),
  domain_id: z.string().optional(),
  name: z.string().optional(),
  value: z.string().optional(),
  type: DNSRecordTypeSchema.optional(),
  priority: z.number().optional(),
  ttl: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export function isDNSRecord(data: unknown): data is DNSRecord {
  return DNSRecordSchema.safeParse(data).success;
}

// DNSRecordConfig describes the parameters for a new DNS record
// none of the fields are mandatory and will be automatically
// set with default values
export const DNSRecordConfigSchema = z.object({
  type: DNSRecordTypeSchema,
  name: z.string(),
  value: z.string(),
  priority: z.number(),
  ttl: z.string(),
});
export function isDNSRecordConfig(data: unknown): data is DNSRecordConfig {
  return DNSRecordConfigSchema.safeParse(data).success;
}

// DNSRecordTypeA represents an A record
export const DNSRecordTypeA = 'A';
// DNSRecordTypeCName represents an CNAME record
export const DNSRecordTypeCName = 'CNAME';
// DNSRecordTypeMX represents an MX record
export const DNSRecordTypeMX = 'MX';
// DNSRecordTypeSRV represents an SRV record
export const DNSRecordTypeSRV = 'SRV';
// DNSRecordTypeTXT represents an TXT record
export const DNSRecordTypeTXT = 'TXT';
