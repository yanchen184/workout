import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary 組件用於捕獲子組件樹中的 JavaScript 錯誤
 * 並顯示友好的錯誤提示界面，防止整個應用崩潰
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能夠顯示降級後的 UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 記錄錯誤到錯誤報告服務
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // 這裡可以將錯誤發送到日誌服務
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定義 fallback UI，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 否則顯示默認錯誤 UI
      return (
        <div style={{
          padding: '48px',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Result
            status="error"
            title="糟糕！發生了一些錯誤"
            subTitle={
              process.env.NODE_ENV === 'development'
                ? this.state.error?.message
                : '我們正在努力修復這個問題，請稍後再試。'
            }
            extra={[
              <Button type="primary" key="reload" onClick={() => window.location.reload()}>
                重新載入頁面
              </Button>,
              <Button key="reset" onClick={this.handleReset}>
                返回
              </Button>,
            ]}
          >
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginTop: 16 }}>
                <summary style={{ cursor: 'pointer', marginBottom: 8 }}>
                  查看錯誤詳情
                </summary>
                <code style={{
                  display: 'block',
                  padding: 16,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 4,
                  fontSize: 12,
                }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </code>
              </details>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
