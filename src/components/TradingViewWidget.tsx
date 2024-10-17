import { useEffect, useRef, memo, useState } from 'react';

// Declare the TradingView type
declare const TradingView: any;

interface TradingViewWidgetProps {
  onDataUpdate: (data: any) => void;
}

function TradingViewWidget({ onDataUpdate }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const [, setWidgetInstance] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== 'undefined') {
        const widget = new TradingView.widget({
          autosize: true,
          symbol: "EURUSD",
          interval: "240",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          hide_side_toolbar: false,
          allow_symbol_change: true,
          calendar: false,
          hide_volume: true,
          container_id: "tradingview_widget",
        });

        widget.onChartReady(() => {
          setWidgetInstance(widget);
          // Example of getting data
          const symbolInfo = widget.symbolInterval();
          onDataUpdate({ symbol: symbolInfo.symbol, interval: symbolInfo.interval });
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onDataUpdate]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div id="tradingview_widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
