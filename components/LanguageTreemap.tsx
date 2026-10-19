import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/styles/GithubPage.module.css';
import { formatBytes } from '@/utils/languageColors';

export interface LanguageRepositoryUsage {
  name: string;
  url: string;
  bytes: number;
}

export interface LanguageData {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
  repositories: LanguageRepositoryUsage[];
}

interface Dimensions {
  width: number;
  height: number;
}

interface TreemapRectangle extends Dimensions {
  x: number;
  y: number;
}

interface TreemapTile extends TreemapRectangle {
  language: LanguageData;
}

interface WeightedLanguage {
  language: LanguageData;
  area: number;
}

const getWorstAspectRatio = (row: WeightedLanguage[], side: number) => {
  if (row.length === 0 || side <= 0) return Number.POSITIVE_INFINITY;

  const areas = row.map((item) => item.area);
  const totalArea = areas.reduce((sum, area) => sum + area, 0);
  const smallestArea = Math.min(...areas);
  const largestArea = Math.max(...areas);

  if (smallestArea <= 0 || totalArea <= 0) return Number.POSITIVE_INFINITY;

  return Math.max(
    (side * side * largestArea) / (totalArea * totalArea),
    (totalArea * totalArea) / (side * side * smallestArea),
  );
};

/** Arrange language tiles into a squarified treemap so each tile's area reflects its code-byte share. */
const createTreemap = (languages: LanguageData[], dimensions: Dimensions): TreemapTile[] => {
  const totalBytes = languages.reduce((sum, language) => sum + language.bytes, 0);
  if (totalBytes <= 0 || dimensions.width <= 0 || dimensions.height <= 0) return [];

  const remaining: WeightedLanguage[] = languages
    .filter((language) => language.bytes > 0)
    .sort((a, b) => b.bytes - a.bytes)
    .map((language) => ({
      language,
      area: (language.bytes / totalBytes) * dimensions.width * dimensions.height,
    }));

  const tiles: TreemapTile[] = [];
  let x = 0;
  let y = 0;
  let width = dimensions.width;
  let height = dimensions.height;

  while (remaining.length > 0 && width > 0 && height > 0) {
    const side = Math.min(width, height);
    const row: WeightedLanguage[] = [];

    while (remaining.length > 0) {
      const candidate = remaining[0];
      const nextRow = [...row, candidate];

      if (row.length === 0 || getWorstAspectRatio(nextRow, side) <= getWorstAspectRatio(row, side)) {
        row.push(candidate);
        remaining.shift();
      } else {
        break;
      }
    }

    const rowArea = row.reduce((sum, item) => sum + item.area, 0);

    if (width >= height) {
      const stripWidth = Math.min(width, rowArea / height);
      let tileY = y;

      row.forEach((item) => {
        const tileHeight = rowArea > 0 ? (item.area / (stripWidth * height)) * height : 0;
        tiles.push({
          language: item.language,
          x,
          y: tileY,
          width: stripWidth,
          height: tileHeight,
        });
        tileY += tileHeight;
      });

      x += stripWidth;
      width = Math.max(0, width - stripWidth);
    } else {
      const stripHeight = Math.min(height, rowArea / width);
      let tileX = x;

      row.forEach((item) => {
        const tileWidth = rowArea > 0 ? (item.area / (stripHeight * width)) * width : 0;
        tiles.push({
          language: item.language,
          x: tileX,
          y,
          width: tileWidth,
          height: stripHeight,
        });
        tileX += tileWidth;
      });

      y += stripHeight;
      height = Math.max(0, height - stripHeight);
    }
  }

  return tiles;
};

const formatPercentage = (percentage: number) => (
  percentage >= 0.01 ? `${percentage.toFixed(2)}%` : `${percentage.toFixed(4)}%`
);

interface LanguageTreemapProps {
  languages: LanguageData[];
}

const LanguageTreemap = ({ languages }: LanguageTreemapProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 1000, height: 500 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(([entry]) => {
      const nextDimensions = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };

      setDimensions((current) => (
        Math.abs(current.width - nextDimensions.width) < 1 && Math.abs(current.height - nextDimensions.height) < 1
          ? current
          : nextDimensions
      ));
    });

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const tiles = useMemo(() => createTreemap(languages, dimensions), [languages, dimensions]);

  return (
    <>
      <div className={styles.chartSection}>
        <div className={styles.treemapIntro}>
          <div>
            <h3 className={styles.treemapTitle}>Language map</h3>
            <p className={styles.treemapHint}>
              Tile area represents code bytes. Hover or focus a tile to see its repositories; on touch screens, use the list below.
            </p>
          </div>
          <span className={styles.treemapScale}>Larger tile = more code</span>
        </div>

        <div ref={stageRef} className={styles.treemapStage} role="group" aria-label="Programming language distribution treemap">
          {tiles.map((tile, tileIndex) => {
            const { language } = tile;
            const tileWidth = tile.width;
            const tileHeight = tile.height;
            const compact = tileWidth < 138 || tileHeight < 82;
            const showName = tileWidth >= 62 && tileHeight >= 38;
            const tooltipId = `language-repositories-${language.name.replace(/[^a-zA-Z0-9_-]/g, '-')}-${tileIndex}`;

            return (
              <div
                key={language.name}
                className={styles.treemapTileWrapper}
                style={{
                  left: `${(tile.x / dimensions.width) * 100}%`,
                  top: `${(tile.y / dimensions.height) * 100}%`,
                  width: `${(tile.width / dimensions.width) * 100}%`,
                  height: `${(tile.height / dimensions.height) * 100}%`,
                  '--language-color': language.color,
                } as CSSProperties}
                data-tooltip-horizontal={tile.x + tile.width / 2 > dimensions.width / 2 ? 'right' : 'left'}
                data-tooltip-vertical={tile.y + tile.height / 2 > dimensions.height / 2 ? 'above' : 'below'}
                role="group"
                tabIndex={0}
                aria-describedby={tooltipId}
                aria-label={`${language.name}, ${formatPercentage(language.percentage)}, ${formatBytes(language.bytes)}, used in ${language.repositories.length} repositories. Focus to browse repositories.`}
              >
                <div className={`${styles.treemapTile} ${compact ? styles.treemapTileCompact : ''}`}>
                  {showName && <span className={styles.treemapLanguageName}>{compact ? language.name.slice(0, 2) : language.name}</span>}
                  {!compact && (
                    <>
                      <span className={styles.treemapPercentage}>{formatPercentage(language.percentage)}</span>
                      <span className={styles.treemapRepoCount}>{language.repositories.length} repos</span>
                    </>
                  )}
                </div>

                <div id={tooltipId} className={styles.languageTooltip} role="group" aria-label={`${language.name} repositories`}>
                  <div className={styles.languageTooltipHeader}>
                    <strong>{language.name}</strong>
                    <span>{formatPercentage(language.percentage)} · {formatBytes(language.bytes)}</span>
                  </div>
                  <div className={styles.languageTooltipSubhead}>
                    Used in {language.repositories.length} {language.repositories.length === 1 ? 'repository' : 'repositories'}
                  </div>
                  {language.repositories.length > 0 ? (
                    <ul className={styles.languageTooltipRepos}>
                      {language.repositories.map((repository) => (
                        <li key={repository.url}>
                          <a href={repository.url} target="_blank" rel="noopener noreferrer">
                            <span>{repository.name}</span>
                            <span>{formatBytes(repository.bytes)}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.languageTooltipEmpty}>Repository details are unavailable.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.languageDirectory}>
        <h3 className={styles.languageDirectoryTitle}>Browse by language</h3>
        <div className={styles.languageDirectoryGrid}>
          {languages.map((language) => (
            <details
              key={language.name}
              className={styles.languageDetails}
              style={{ '--language-color': language.color } as CSSProperties}
            >
              <summary className={styles.languageSummary}>
                <span className={styles.languageIcon} />
                <span className={styles.languageSummaryName}>{language.name}</span>
                <span className={styles.languagePercentage}>{formatPercentage(language.percentage)}</span>
                <span className={styles.languageRepoCount}>{language.repositories.length} repos</span>
              </summary>
              <div className={styles.languageDetailsBody}>
                <div className={styles.languageBytes}>{formatBytes(language.bytes)} of detected code</div>
                {language.repositories.length > 0 ? (
                  <ul className={styles.languageRepoList}>
                    {language.repositories.map((repository) => (
                      <li key={repository.url}>
                        <a href={repository.url} target="_blank" rel="noopener noreferrer">
                          <span>{repository.name}</span>
                          <span>{formatBytes(repository.bytes)}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.languageTooltipEmpty}>Repository details are unavailable.</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
};

export default LanguageTreemap;
