import { toString } from "./utils";

const renderChart = (props) => {
  const height = `${props.height || 400}px`;
  const width = props.width ? `${props.width}px` : "auto";
  const backgroundColor = props.backgroundColor;
  return `
      document.getElementById('main').style.height = "${height}";
      document.getElementById('main').style.width = "${width}";
      document.getElementById('main').style.backgroundColor = "${backgroundColor}";
      var myChart = echarts.init(document.getElementById('main'));

      let timer = null;

      myChart.setOption(${toString(props.option)});
      myChart.on('click', function(params) {
        var seen = [];
        var paramsString = JSON.stringify(params, function(key, val) {
          if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
              return;
            }
            seen.push(val);
          }
          return val;
        });
        window.ReactNativeWebView.postMessage(JSON.stringify({"types":"ON_PRESS","payload": paramsString}));
      });
      myChart.on('highlight', function(params) {
        timer && clearTimeout(timer)
        var seen = [];
        var paramsString = JSON.stringify(params, function(key, val) {
          if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
              return;
            }
            seen.push(val);
          }
          return val;
        });
        window.ReactNativeWebView.postMessage(JSON.stringify({"types":"ON_HIGHTLIGHT","payload": paramsString}));
      });
      myChart.on('downplay', function(params) {
        timer = setTimeout(() => {
          myChart.dispatchAction({
            type: 'hideTip'
          })
        }, 500)

      });
      function onTooltipEdit(index) {
        window.ReactNativeWebView.postMessage(JSON.stringify({"types":"ON_TOOLTIP","payload": JSON.stringify({index})}));
      }
      function onModeEdit(index) {
        window.ReactNativeWebView.postMessage(JSON.stringify({"types":"ON_MODE_EDIT","payload": JSON.stringify({index})}));
      }
      window.onTooltipEdit = onTooltipEdit;
      window.onModeEdit = onModeEdit;
    `;
};

export default renderChart;
