import {
  HomeOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ToolOutlined,
  UserOutlined,
  SafetyOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
export const siderConfig = [
  {
    title: 'Home', // 菜单标题名称
    key: '/home', // 对应的path
    icon: <HomeOutlined />, // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: 'Category', // 菜单标题名称
    key: '/product', // 对应的path
    icon: <AppstoreOutlined />, // 图标名称
    children: [
      {
        title: 'Category', // 菜单标题名称
        key: '/category', // 对应的path
        icon: <BarsOutlined />, // 图标名称
      },
      {
        title: 'Products', // 菜单标题名称
        key: '/products', // 对应的path
        icon: <ToolOutlined />, // 图标名称
      }
    ]
  },
  {
    title: 'Users', // 菜单标题名称
    key: '/users', // 对应的path
    icon: <UserOutlined />, // 图标名称

  },
  {
    title: 'Roles', // 菜单标题名称
    key: '/roles', // 对应的path
    icon: <SafetyOutlined />, // 图标名称
  },
  {
    title: 'Charts', // 菜单标题名称
    key: '/chart',
    icon: <AreaChartOutlined />,
    children: [{
      title: 'Bar chart',
      key: '/barchart',
      icon: <BarChartOutlined />
    },
    {
      title: 'Line chart',
      key: '/linechart',
      icon: <LineChartOutlined />
    },
    {
      title: 'Pie chart',
      key: '/piechart',
      icon: <PieChartOutlined />
    },]
  },
]