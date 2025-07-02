import { ConfigProvider } from "antd";
import zhTW from "antd/locale/zh_TW";
import FirebaseTest from "./pages/FirebaseTest";

function App() {
  return (
    <ConfigProvider locale={zhTW}>
      <FirebaseTest />
    </ConfigProvider>
  );
}

export default App;