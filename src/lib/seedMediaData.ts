// Default media assets for seeding the site-images bucket
export const defaultMediaAssets = {
  hero: [
    { name: 'hero-banner-1.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410100545_7cbd24ec.webp' },
    { name: 'hero-banner-2.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410102965_0bea8aae.webp' },
  ],
  solutions: [
    { name: 'data-exchange.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410104157_263ba774.webp' },
    { name: 'payments.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410106027_37e24fe4.webp' },
    { name: 'identity.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410107865_d1287ad2.webp' },
    { name: 'portal.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410109683_97d01c7b.webp' },
    { name: 'analytics.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410111516_9f0506d3.webp' },
    { name: 'documents.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410113349_ace0cff4.webp' },
  ],
  platforms: [
    { name: 'cloud-infrastructure.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410119601_4906334d.webp' },
    { name: 'api-gateway.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410121578_cdb8bcd7.webp' },
    { name: 'security-framework.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410123424_fcd393dd.webp' },
    { name: 'integration-hub.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410125241_72ad3a01.webp' },
  ],
  about: [
    { name: 'team-member-1.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410126269_ea10d244.webp' },
    { name: 'team-member-2.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410128114_61047079.webp' },
    { name: 'team-member-3.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410130036_ef1f7e8c.webp' },
    { name: 'team-member-4.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410131957_a3e8890b.webp' },
  ],
  'ai-features': [
    { name: 'document-processing.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410137629_ca363941.webp' },
    { name: 'predictive-analytics.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410139603_2628287d.webp' },
    { name: 'fraud-detection.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410142072_82f94847.webp' },
    { name: 'citizen-assistance.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410144018_b104817b.webp' },
  ],
  'case-studies': [
    { name: 'case-study-1.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410145162_b554e5cf.webp' },
    { name: 'case-study-2.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410147065_ca7cdc38.webp' },
    { name: 'case-study-3.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410148993_760e0f69.webp' },
    { name: 'case-study-4.webp', url: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764410151449_0e33bd3e.webp' },
  ],
};

export type MediaCategory = keyof typeof defaultMediaAssets;
export const MEDIA_CATEGORIES: MediaCategory[] = ['hero', 'solutions', 'platforms', 'about', 'ai-features', 'case-studies'];
