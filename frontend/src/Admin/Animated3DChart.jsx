import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const ChartWrap = styled.div`
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 6px 28px rgba(2, 6, 23, 0.06);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-weight: 700;
  color: #111827;
`;

const Legend = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

const Scene = styled.div`
  perspective: 900px;
  height: ${(p) => p.height || 220}px;
  display: flex;
  align-items: flex-end;
`;

const Bars = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-end;
  width: 100%;
  padding: 12px 6px 18px 6px;
`;

const rise = keyframes`
  from { transform: scaleY(0.02); }
  to { transform: scaleY(1); }
`;

const Bar = styled.div`
  --bar-color: ${(p) => p.color || "#6d28d9"};
  flex: 1 1 auto;
  min-width: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BarInner = styled.div`
  transform-style: preserve-3d;
  transform-origin: bottom center;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const AnimatedBarWrap = styled.div`
  width: 100%;
  transform-style: preserve-3d;
  transform-origin: bottom center;
  animation: ${rise} 700ms ease forwards;
`;

const Face = styled.div`
  width: 100%;
  background: linear-gradient(180deg, var(--bar-color), #5b21b6);
  border-radius: 6px 6px 4px 4px;
  box-shadow: 0 8px 18px rgba(75, 0, 130, 0.12);
  transform: translateZ(0px);
  transition: transform 320ms ease, box-shadow 320ms ease;
`;

const TopFace = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.18),
    rgba(0, 0, 0, 0.06)
  );
  transform-origin: center bottom;
  transform: rotateX(60deg) translateY(-6px);
  border-radius: 6px 6px 0 0;
  box-shadow: 0 6px 12px rgba(16, 24, 40, 0.06);
`;

const ValueLabel = styled.div`
  margin-bottom: 8px;
  font-weight: 700;
  color: #0f172a;
  font-size: 0.95rem;
  min-height: 20px;
`;

const XLabel = styled.div`
  margin-top: 10px;
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
  width: 100%;
`;

const Tooltip = styled.div`
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -120%);
  background: rgba(15, 23, 42, 0.95);
  color: white;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 99;
`;

const Animated3DChart = ({
  labels = [],
  values = [],
  height = 220,
  legend = "Monthly",
}) => {
  const [hover, setHover] = useState(null);
  const max = Math.max(...(values.length ? values : [1]));

  useEffect(() => {
    // small perf: ensure values array length matches labels
  }, [labels, values]);

  return (
    <ChartWrap>
      <Header>
        <Title>{legend}</Title>
        <Legend>{labels && labels.length ? labels.join(" • ") : ""}</Legend>
      </Header>

      <Scene height={height}>
        <Bars>
          {values.map((v, i) => {
            const pct = max > 0 ? Math.max(0, v) / max : 0;
            const barHeight = Math.max(6, pct * (height - 60));
            const color = [
              `#3B82F6`,
              `#EF4444`,
              `#DC2626`,
              `#7C3AED`,
              `#10B981`,
            ][i % 5];
            return (
              <Bar key={i} color={color} onMouseLeave={() => setHover(null)}>
                <ValueLabel>{v}</ValueLabel>
                <BarInner style={{ height: `${barHeight}px` }}>
                  <AnimatedBarWrap style={{ height: `${barHeight}px` }}>
                    <Face
                      style={{ height: `${barHeight}px` }}
                      onMouseEnter={(e) =>
                        setHover({
                          x: e.clientX,
                          y: e.clientY,
                          label: labels[i],
                          value: v,
                        })
                      }
                    />
                    <TopFace />
                  </AnimatedBarWrap>
                </BarInner>
                <XLabel>{labels[i]}</XLabel>
              </Bar>
            );
          })}
        </Bars>
        {hover && (
          <Tooltip style={{ left: hover.x, top: hover.y }}>
            {hover.label}: {hover.value}
          </Tooltip>
        )}
      </Scene>
    </ChartWrap>
  );
};

export default Animated3DChart;
