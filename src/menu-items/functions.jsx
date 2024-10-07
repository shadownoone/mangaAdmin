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
      target: true
    },
    {
      id: 'genres',
      title: 'Genres',
      type: 'item',
      url: '/genres',
      icon: icons.ProfileOutlined,
      target: true
    }
  ]
};

export default functions;
