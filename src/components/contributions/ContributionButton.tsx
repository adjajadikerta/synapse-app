import { useState } from 'react';

interface ContributionButtonProps {
  scope: 'paper' | 'topic';
  paperId?: string;
  topicId?: string;
  paperTitle?: string;
  topicTitle?: string;
  onOpenDrawer: (config: {
    scope: 'paper' | 'topic';
    paperId?: string;
    topicId?: string;
    paperTitle?: string;
    topicTitle?: string;
    type?: string;
  }) => void;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const buttonConfigs = {
  paper: {
    primary: {
      icon: '🤝',
      label: 'Contribute',
      description: 'Help improve this paper'
    },
    secondary: {
      icon: '💡',
      label: 'Suggest Topic',
      description: 'Propose a new topic'
    },
    minimal: {
      icon: '🤝',
      label: 'Contribute',
      description: 'Help improve this paper'
    }
  },
  topic: {
    primary: {
      icon: '🤝',
      label: 'Contribute',
      description: 'Help improve this topic'
    },
    secondary: {
      icon: '✏️',
      label: 'Suggest Edit',
      description: 'Propose corrections'
    },
    minimal: {
      icon: '🤝',
      label: 'Contribute',
      description: 'Help improve this topic'
    }
  }
};

const sizeStyles = {
  sm: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.8rem',
    gap: '0.375rem'
  },
  md: {
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    gap: '0.5rem'
  },
  lg: {
    padding: '1rem 1.25rem',
    fontSize: '1rem',
    gap: '0.75rem'
  }
};

const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, #4a90e2 0%, #7b68ee 100%)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.2)',
    hover: {
      background: 'linear-gradient(135deg, #357abd 0%, #6a5acd 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)'
    }
  },
  secondary: {
    background: 'rgba(74, 144, 226, 0.08)',
    color: '#4a90e2',
    border: '1px solid rgba(74, 144, 226, 0.2)',
    boxShadow: 'none',
    hover: {
      background: 'rgba(74, 144, 226, 0.12)',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)'
    }
  },
  minimal: {
    background: 'transparent',
    color: '#4a90e2',
    border: '1px solid #e8e2d5',
    boxShadow: 'none',
    hover: {
      background: 'rgba(74, 144, 226, 0.05)',
      borderColor: '#4a90e2',
      transform: 'none',
      boxShadow: 'none'
    }
  }
};

export default function ContributionButton({
  scope,
  paperId,
  topicId,
  paperTitle,
  topicTitle,
  onOpenDrawer,
  variant = 'primary',
  size = 'md',
  className = ''
}: ContributionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const config = buttonConfigs[scope][variant];
  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];

  const handleClick = () => {
    onOpenDrawer({
      scope,
      paperId,
      topicId,
      paperTitle,
      topicTitle
    });
  };

  type BtnStyle = Partial<{
    background: string; color: string; border: string; boxShadow: string; transform: string;
    hover: { background: string; transform: string; boxShadow: string };
  }>;
  const currentStyle: BtnStyle = isHovered ? variantStyle.hover : variantStyle;

  return (
    <button
      className={className}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: sizeStyle.gap,
        padding: sizeStyle.padding,
        background: currentStyle.background,
        color: currentStyle.color ?? '#4a90e2',
        border: currentStyle.border ?? 'none',
        borderRadius: '8px',
        fontSize: sizeStyle.fontSize,
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: currentStyle.boxShadow ?? 'none',
        transform: currentStyle.transform ?? 'none',
        outline: 'none',
        minWidth: size === 'sm' ? 'auto' : '120px',
        justifyContent: 'center'
      }}
      title={config.description}
    >
      <span style={{ fontSize: size === 'sm' ? '0.9em' : '1em' }}>
        {config.icon}
      </span>
      <span>{config.label}</span>
    </button>
  );
}

// Specialized button components for common use cases
export function PaperContributeButton({
  paperId,
  paperTitle,
  onOpenDrawer,
  variant = 'primary',
  size = 'md'
}: {
  paperId: string;
  paperTitle: string;
  onOpenDrawer: (config: any) => void;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <ContributionButton
      scope="paper"
      paperId={paperId}
      paperTitle={paperTitle}
      onOpenDrawer={onOpenDrawer}
      variant={variant}
      size={size}
    />
  );
}

export function TopicContributeButton({
  topicId,
  topicTitle,
  onOpenDrawer,
  variant = 'primary',
  size = 'md'
}: {
  topicId: string;
  topicTitle: string;
  onOpenDrawer: (config: any) => void;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <ContributionButton
      scope="topic"
      topicId={topicId}
      topicTitle={topicTitle}
      onOpenDrawer={onOpenDrawer}
      variant={variant}
      size={size}
    />
  );
}

export function SuggestNewTopicButton({
  onOpenDrawer,
  variant = 'secondary',
  size = 'md'
}: {
  onOpenDrawer: (config: any) => void;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <ContributionButton
      scope="topic"
      onOpenDrawer={onOpenDrawer}
      variant={variant}
      size={size}
    />
  );
}
