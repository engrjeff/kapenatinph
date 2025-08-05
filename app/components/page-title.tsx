import React from 'react';

interface PageTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div>
      <h1 className="font-semibold text-lg">{title}</h1>
      {subtitle ? (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
