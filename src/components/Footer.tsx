import './Footer.css';

interface Props {
  onClearDone: () => void;
  hasDone: boolean;
}

export default function Footer({ onClearDone, hasDone }: Props) {
  return (
    <>
      <div className="clear-section">
        <button
          className="btn-clear"
          onClick={onClearDone}
          disabled={!hasDone}
        >
          🧹 清除已完成
        </button>
      </div>
      <div className="footer-decor">
        <span>✿</span><span>❀</span><span>✿</span><span>❀</span><span>✿</span>
      </div>
    </>
  );
}
