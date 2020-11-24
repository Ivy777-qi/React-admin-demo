// 建立上下文件关系
const files = require.context('../../pages/', true, /\.js$/); // 第一个参数：目录，第二参数：是否查找子级目录，第三参数：指定查找到文件
//声明组件对象
const AutoComponents = [];
// 循环文件
files.keys().map((key => {
  if (key.includes('./index/') || key.includes('./home/') || key.includes('./login/')) { return false; }
  const splitFilename = key.split('.');
  console.log(splitFilename);
  let path = `${splitFilename[1]}`.split('/');
  path = `${path[2]}`.toLowerCase();
  path = `/${path}`;
  console.log(path);
  const component = files(key).default;

  // 写入对象
  const Obj = {};
  Obj.path = path;
  Obj.component = component;

  AutoComponents.push(Obj);
  console.log(AutoComponents);
}))
export default AutoComponents;