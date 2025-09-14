import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Contribution, PaperContribution, TopicContribution } from '../types/contributions';

// Store state interface
interface ContributionsState {
  contributions: Contribution[];
  isLoading: boolean;
  error: string | null;
}

// Store actions interface
interface ContributionsActions {
  addContribution: (contribution: Contribution) => void;
  updateContributionStatus: (id: string, status: Contribution['status']) => void;
  getContributionsByScope: (scope: 'paper' | 'topic') => Contribution[];
  getContributionsByStatus: (status: Contribution['status']) => Contribution[];
  getContributionsByPaperId: (paperId: string) => PaperContribution[];
  getContributionsByTopicId: (topicId: string) => TopicContribution[];
  clearError: () => void;
}

// Combined store interface
interface ContributionsStore extends ContributionsState, ContributionsActions {}

// Create context
const ContributionsContext = createContext<ContributionsStore | undefined>(undefined);

// Provider component
interface ContributionsProviderProps {
  children: ReactNode;
}

export function ContributionsProvider({ children }: ContributionsProviderProps) {
  const [state, setState] = useState<ContributionsState>({
    contributions: [],
    isLoading: false,
    error: null
  });

  const addContribution = useCallback((contribution: Contribution) => {
    setState(prev => ({
      ...prev,
      contributions: [contribution, ...prev.contributions]
    }));
  }, []);

  const updateContributionStatus = useCallback((id: string, status: Contribution['status']) => {
    setState(prev => ({
      ...prev,
      contributions: prev.contributions.map(contrib => 
        contrib.id === id ? { ...contrib, status } : contrib
      )
    }));
  }, []);

  const getContributionsByScope = useCallback((scope: 'paper' | 'topic') => {
    return state.contributions.filter(contrib => contrib.scope === scope);
  }, [state.contributions]);

  const getContributionsByStatus = useCallback((status: Contribution['status']) => {
    return state.contributions.filter(contrib => contrib.status === status);
  }, [state.contributions]);

  const getContributionsByPaperId = useCallback((paperId: string) => {
    return state.contributions.filter((contrib): contrib is PaperContribution => 
      contrib.scope === 'paper' && contrib.paperId === paperId
    );
  }, [state.contributions]);

  const getContributionsByTopicId = useCallback((topicId: string) => {
    return state.contributions.filter((contrib): contrib is TopicContribution => 
      contrib.scope === 'topic' && contrib.topicId === topicId
    );
  }, [state.contributions]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const store: ContributionsStore = {
    ...state,
    addContribution,
    updateContributionStatus,
    getContributionsByScope,
    getContributionsByStatus,
    getContributionsByPaperId,
    getContributionsByTopicId,
    clearError
  };

  return React.createElement(
    ContributionsContext.Provider,
    { value: store },
    children
  );
}

// Hook to use the store
export function useContributionsStore() {
  const context = useContext(ContributionsContext);
  if (context === undefined) {
    throw new Error('useContributionsStore must be used within a ContributionsProvider');
  }
  return context;
}

// API stub implementation
export async function submitContribution(input: Omit<Contribution,'id'|'status'|'createdAt'>): Promise<Contribution> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const contribution: Contribution = {
    ...input,
    id: `contrib-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    createdAt: new Date(),
    createdBy: {
      id: 'current-user',
      name: 'Current User'
    }
  } as Contribution;

  // In a real app, this would make an API call
  console.log('Submitting contribution:', contribution);
  
  return contribution;
}
