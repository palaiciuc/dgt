import { supabase } from '@/lib/supabase';

export const defaultSolutions = [
  { tag: 'Data Exchange', title: 'Government Data Exchange', description: 'Secure, real-time data sharing between government agencies with full audit trails and compliance.', icon: 'Database', display_order: 1, is_active: true },
  { tag: 'Payments', title: 'Digital Payments Platform', description: 'End-to-end payment processing for taxes, fees, and government services with multiple payment methods.', icon: 'CreditCard', display_order: 2, is_active: true },
  { tag: 'Identity', title: 'Digital Identity Services', description: 'Secure citizen authentication and identity verification for seamless access to public services.', icon: 'Shield', display_order: 3, is_active: true },
  { tag: 'Portal', title: 'Citizen Service Portal', description: 'Unified digital gateway for citizens to access all government services in one place.', icon: 'Globe', display_order: 4, is_active: true },
  { tag: 'Analytics', title: 'Government Analytics', description: 'Data-driven insights and dashboards for informed policy decisions and resource allocation.', icon: 'BarChart3', display_order: 5, is_active: true },
  { tag: 'Documents', title: 'Document Management', description: 'Secure digital document storage, verification, and workflow automation for government processes.', icon: 'FileText', display_order: 6, is_active: true },
];

export const defaultPlatforms = [
  { title: 'Cloud Infrastructure', description: 'Secure, scalable government cloud with compliance certifications and data sovereignty.', icon: 'Cloud', display_order: 1, is_active: true },
  { title: 'API Gateway', description: 'Centralized API management for secure inter-agency communication and third-party integrations.', icon: 'Layers', display_order: 2, is_active: true },
  { title: 'Security Framework', description: 'Zero-trust security architecture with continuous monitoring and threat detection.', icon: 'Lock', display_order: 3, is_active: true },
  { title: 'Integration Hub', description: 'Connect legacy systems with modern applications through standardized interfaces.', icon: 'Zap', display_order: 4, is_active: true },
];

export const defaultAIFeatures = [
  { title: 'Document Processing', description: 'AI-powered extraction and classification of information from government documents.', icon: 'FileSearch', display_order: 1, is_active: true },
  { title: 'Predictive Analytics', description: 'Machine learning models for forecasting demand and optimizing resource allocation.', icon: 'LineChart', display_order: 2, is_active: true },
  { title: 'Fraud Detection', description: 'Real-time anomaly detection to identify and prevent fraudulent activities.', icon: 'AlertTriangle', display_order: 3, is_active: true },
  { title: 'Citizen Assistance', description: 'AI chatbots and virtual assistants for 24/7 citizen support and guidance.', icon: 'Users', display_order: 4, is_active: true },
];

export const defaultAboutValues = [
  { title: 'Innovation', description: 'We continuously explore emerging technologies to deliver cutting-edge solutions.', icon: 'Lightbulb', display_order: 1, is_active: true },
  { title: 'Security', description: 'We prioritize data protection and privacy in everything we build.', icon: 'Shield', display_order: 2, is_active: true },
  { title: 'Excellence', description: 'We strive for the highest quality in our products and services.', icon: 'Award', display_order: 3, is_active: true },
  { title: 'Collaboration', description: 'We work closely with government partners to achieve shared goals.', icon: 'Users', display_order: 4, is_active: true },
];
