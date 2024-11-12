// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA FUNCTIONS ||============================== //

const functions = {
  id: 'functions',
  title: 'Functions',
  type: 'group',
  children: [
    {
      id: 'manga',
      title: 'Manga',
      type: 'item',
      url: '/manga',
      icon: icons.LoginOutlined,
      target: false,
      breadcrumbs: true
    },
    {
      id: 'genre',
      title: 'Genre',
      type: 'item',
      url: '/genre',
      icon: icons.ProfileOutlined,
      target: false,
      breadcrumbs: true
    },
    {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      icon: icons.ProfileOutlined,
      target: false,
      breadcrumbs: true
    },
    {
      id: 'chapter',
      title: 'Chapter',
      type: 'item',
      url: '/chapter',
      icon: icons.ProfileOutlined,
      target: false,
      breadcrumbs: true
    }
  ]
};

export default functions;
