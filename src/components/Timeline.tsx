"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

type TimelineItemType = 'writing' | 'work' | 'project';

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  link?: string;
  type: TimelineItemType;
  sortDate?: string;
}

// ===============
// HELPER FUNCTIONS
// ===============

// Extract year from sortDate
const getYearFromSortDate = (sortDate?: string): number => {
  if (!sortDate) return 0;
  const yearMatch = sortDate.match(/^(\d{4})/);
  return yearMatch ? parseInt(yearMatch[1], 10) : 0;
};

// Extract month for sorting
const getMonthForSorting = (dateStr: string): number => {
  if (!dateStr) return 0;
  const months: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };
  const monthMatch = dateStr.match(/^([a-z]{3})/i);
  if (monthMatch) {
    return months[monthMatch[1].toLowerCase()] || 0;
  }
  return 0;
};

// ==========
// Alex's DATA
// ==========

const rawTimelineItems: TimelineItem[] = [
    {
      date: 'march',
      title: 'identity-ai one-shot llm context',
      description: 'created a one-shot knowledge document for identity and community ai on farcaster, using structured workflows to generate comprehensive documentation from fragmented project files (ai workflow project manager).',
      link: 'https://github.com/alexpaden/identity-ai',
      type: 'project',
      sortDate: '2025-03'
    },
    {
      date: 'february',
      title: 'comic sans plugin for eliza',
      description: 'developed an open-source elizaos plugin that detects comic sans font in images and rewards users with $comicsans tokens on the base network.',
      link: 'https://github.com/alexpaden/eliza/tree/plugin/comic-sans/packages/plugin-comic-sans',
      type: 'project',
      sortDate: '2025-02'
    },
    {
      date: 'december',
      title: 'digital pantheon: crypto agent futures',
      description: 'explored a future where ai agents rule the cryptosphere, reshaping markets, identity, and governance through an evolutionary dance of online identities.',
      link: 'https://blog.alexpaden.tech/digital-pantheon-agent-futures',
      type: 'writing',
      sortDate: '2024-12'
    },
    {
      date: 'july',
      title: 'farcaster fid manager',
      description: 'forked an implementation enabling account transfers, recovery, new seed generation, and signature generation through a smart contract and web interface.',
      link: 'https://github.com/alexpaden/farcaster-fid-manager',
      type: 'project',
      sortDate: '2024-07'
    },
    {
      date: 'may',
      title: 'neynar indexer',
      description: 'original open-source indexer to replicate farcaster databases efficiently using parquet files for optimized cost and performance.',
      link: 'https://github.com/alexpaden/neynar-indexer',
      type: 'project',
      sortDate: '2024-05'
    },
    {
      date: 'jun → apr 2024',
      title: 'data systems @ caliber resource partners',
      description: 'analyzed and standardized accounting and production data for petroleum deals; built ai-enhanced data pipelines for key portfolio assets.',
      link: 'https://www.linkedin.com/in/alexpaden',
      type: 'work',
      sortDate: '2023-06'
    },
    {
      date: 'march → may',
      title: 'ditti farcaster tools',
      description: 'developed multi-purpose farcaster tools including a multi-command bot with translation and gpt integration, and a follow management system based on activity, account age, and mutual relationships; uncovered a critical hub vulnerability.',
      type: 'project',
      sortDate: '2023-03'
    },
    {
      date: 'may',
      title: 'farcaster analytics suite',
      description: 'created comprehensive analytics tools, including dune dashboards for account and protocol analytics, and specialized farcasterxdune and neynarxdune custom gpts.',
      link: 'https://dune.com/shoni_eth/farcaster-protocol-analytics',
      type: 'project',
      sortDate: '2023-05'
    },
    {
      date: 'february',
      title: 'farcaster-py',
      description: 'open-source contributor to the a16z python library for warpcast apis.',
      link: 'https://github.com/a16z/farcaster-py',
      type: 'project',
      sortDate: '2023-02'
    },
    {
      date: 'march',
      title: 'swish: paypal for digital identity',
      description: 'conceptualized a digital identity platform providing verification services with minimal disclosure, designed as a reusable identity layer for web2 and web3 applications.',
      link: 'https://hackernoon.com/swish-paypal-for-digital-identity',
      type: 'writing',
      sortDate: '2022-03'
    },
    {
      date: 'february',
      title: 'exmail: redesigning consumer email',
      description: 'proposed an extended email platform allowing separation of concerns, inbox aggregation, and multiple email addresses, combined with privacy relay technology at the group level.',
      link: 'https://hackernoon.com/exmail-a-cool-new-email-4-the-internet',
      type: 'writing',
      sortDate: '2022-02'
    },
    {
      date: 'jan → jan 2022',
      title: 'founder @ swish.id',
      description: 'designed and deployed kyc identity products, built ssr web app with sso authentication and custom kyc stack using google vision and tesseract.',
      link: 'https://www.linkedin.com/in/alexpaden',
      type: 'work',
      sortDate: '2020-01'
    },
    {
      date: 'march → dec 2019',
      title: 'co-founder @ rocketr.net',
      description: 'managed four products: storefront, payments, pos, and creator tipping; enabled 50,000+ merchants to process $10m+ in payments and secured a $500k investment from bitmain.',
      link: 'https://www.linkedin.com/in/alexpaden',
      type: 'work',
      sortDate: '2016-01'
    },
    {
      date: 'jan → jan 2017',
      title: 'product specialist @ john sisson motors',
      description: 'managed pre- and post-sale deliveries of new and used cars, including consumer and freight vehicles.',
      link: 'https://www.linkedin.com/in/alexpaden',
      type: 'work',
      sortDate: '2014-01'
    }
  ];
  
  

// ==========
// SORTING LOGIC
// ==========

const timelineItems = [...rawTimelineItems].sort((a, b) => {
  if (a.sortDate && b.sortDate) {
    return a.sortDate > b.sortDate ? -1 : 1;
  }
  const aPresent = a.date.toLowerCase().includes('present');
  const bPresent = b.date.toLowerCase().includes('present');
  if (aPresent && !bPresent) return -1;
  if (bPresent && !aPresent) return 1;
  const yearA = getYearFromSortDate(a.sortDate);
  const yearB = getYearFromSortDate(b.sortDate);
  if (yearA !== yearB) {
    return yearB - yearA;
  }
  const monthA = getMonthForSorting(a.date);
  const monthB = getMonthForSorting(b.date);
  if (monthA !== monthB) {
    return monthB - monthA;
  }
  const typeOrder: Record<TimelineItemType, number> = { work: 1, project: 2, writing: 3 };
  return (typeOrder[a.type] || 0) - (typeOrder[b.type] || 0);
});

// ======================
// TIMELINE COMPONENT
// ======================

const Timeline: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Render the title with optional link
  const renderTitle = (item: TimelineItem) => {
    // Special cases for entries with description links
    if (item.title === 'farcaster analytics suite' || item.title === 'ditti farcaster tools') {
      return <span>{item.title}</span>;
    }
    
    if (item.link) {
      return (
        <Link
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'} flex items-center`}
        >
          {item.title}
          {item.type !== 'work' && <span className="ml-1">↗</span>}
        </Link>
      );
    }
    return <span>{item.title}</span>;
  };

  // Render custom description with links
  const renderDescription = (item: TimelineItem) => {
    if (item.title === 'farcaster analytics suite' && item.description) {
      return (
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-0`}>
          created comprehensive analytics tools including{' '}
          <a href="https://dune.com/shoni_eth/farcaster-group" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}>
            protocol analytics
          </a>,{' '}
          <a href="https://dune.com/shoni_eth/farcaster-account-analytics" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}>
            account analytics
          </a>, and{' '}
          <a href="https://chatgpt.com/g/g-lKnQHXJKS-dune-x-farcaster-gpt" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}>
            specialized gpts
          </a>.
        </div>
      );
    }
    
    if (item.title === 'ditti farcaster tools' && item.description) {
      return (
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-0`}>
          developed multi-purpose farcaster tools including a{' '}
          <a href="https://github.com/alexpaden/ditti" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}>
            multi-command bot
          </a>{' '}
          with translation and gpt integration, and a{' '}
          <a href="https://github.com/alexpaden/ditti-boost" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}>
            follow management system
          </a>{' '}
          based on activity, account age, and mutual relationships; uncovered a critical hub vulnerability.
        </div>
      );
    }
    
    return item.description ? (
      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-0`}>
        {item.description}
      </div>
    ) : null;
  };

  // Get indicator symbol
  const getIndicatorSymbol = (type: TimelineItemType) => {
    switch (type) {
      case 'work': return '■';
      case 'project': return '▹';
      case 'writing': return '✐';
      default: return '○';
    }
  };

  // Get symbol color class
  const getSymbolColorClass = (type: TimelineItemType) => {
    switch (type) {
      case 'work': return theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
      case 'project': return theme === 'dark' ? 'text-blue-400' : 'text-blue-500';
      case 'writing': return theme === 'dark' ? 'text-green-400' : 'text-green-500';
      default: return theme === 'dark' ? 'text-gray-300' : 'text-gray-400';
    }
  };

  // Track last displayed year
  let mobileLastYear: number | null = null;
  let desktopLastYear: number | null = null;

  return (
    <div className="w-full p-3">
      {/* Legend */}
      <div className="mb-4 flex gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>■</span> 
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Work</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}>▹</span> 
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Project</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={theme === 'dark' ? 'text-green-400' : 'text-green-500'}>✐</span> 
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Writing</span>
        </div>
      </div>

      {/* Mobile Timeline Content (2-column layout) */}
      <div 
        ref={timelineRef}
        className="relative grid gap-2 md:hidden"
        style={{ gridTemplateColumns: 'minmax(120px, 1fr) 3fr' }}
      >
        {timelineItems.map((item, index) => {
          const currentYear = getYearFromSortDate(item.sortDate);
          const showYear = currentYear !== mobileLastYear;
          mobileLastYear = currentYear;
          
          return (
            <React.Fragment key={index}>
              {/* Combined Year/Date Column */}
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex flex-col justify-center`}>
                {showYear && <div className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>{currentYear}</div>}
                <div className="whitespace-normal break-words">
                  {item.date}
                </div>
              </div>

              {/* Content Column */}
              <div className="flex items-start gap-1.5">
                <span className={`${getSymbolColorClass(item.type)} mt-1`}>
                  {getIndicatorSymbol(item.type)}
                </span>
                <div className="flex-1">
                  <div className="font-bold">{renderTitle(item)}</div>
                  {renderDescription(item)}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Desktop Timeline Content (3-column layout) */}
      <div
        className="relative grid gap-2 hidden md:grid"
        style={{ gridTemplateColumns: 'minmax(40px, 60px) minmax(80px, 140px) 1fr' }}
      >
        {timelineItems.map((item, index) => {
          const currentYear = getYearFromSortDate(item.sortDate);
          const showYear = currentYear !== desktopLastYear;
          desktopLastYear = currentYear;
          
          return (
            <React.Fragment key={`desktop-${index}`}>
              {/* Year Column */}
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} flex items-center`}>
                {showYear ? currentYear : ''}
              </div>

              {/* Date Column */}
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex items-center whitespace-normal break-words`}>
                {item.date}
              </div>

              {/* Content Column */}
              <div className="flex items-start gap-1.5">
                <span className={`${getSymbolColorClass(item.type)} mt-1`}>
                  {getIndicatorSymbol(item.type)}
                </span>
                <div className="flex-1">
                  <div className="font-bold">{renderTitle(item)}</div>
                  {renderDescription(item)}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;