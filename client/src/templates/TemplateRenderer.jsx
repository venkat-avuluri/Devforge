import React from 'react';
import ModernTemplate from './ModernTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import FestTemplate from './FestTemplate';

const TemplateRenderer = ({ event, onRegister, isPreview = false }) => {
  if (!event) return null;

  const templateType = (event.template || 'modern').toLowerCase();

  switch (templateType) {
    case 'professional':
      return <ProfessionalTemplate event={event} onRegister={onRegister} isPreview={isPreview} />;
    case 'fest':
      return <FestTemplate event={event} onRegister={onRegister} isPreview={isPreview} />;
    case 'modern':
    default:
      return <ModernTemplate event={event} onRegister={onRegister} isPreview={isPreview} />;
  }
};

export default TemplateRenderer;
