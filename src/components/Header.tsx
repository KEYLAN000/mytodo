import { useMemo } from 'react';
import './Header.css';

const RING_COUNT = 7;

export default function Header() {
  const rings = useMemo(
    () => Array.from({ length: RING_COUNT }, (_, i) => <div key={i} className="ring" />),
    []
  );

  const now = new Date();

  return (
    <>
      {/* 装订环 */}
      <div className="rings">{rings}</div>

      {/* 头部 */}
      <div className="header">
        <div className="washi-tape" />
        <div className="washi-tape" />
        <div className="washi-tape" />

        <div className="header-content">
          <div className="title-group">
            <span className="title-icon">📒</span>
            <h1 className="title">待办手账</h1>
          </div>
          <div className="date-stamp">
            <span className="day">{now.getDate()}</span>
            <span>{now.getMonth() + 1}月</span>
          </div>
        </div>
      </div>
    </>
  );
}
