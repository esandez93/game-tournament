import {
  Home,
  Login,
  Matches,
  Ranking,
  ThemeTest,
  Users
} from '@/pages';

export default [{
  path: '/',
  component: Home,
  // auth: true
}, {
  path: '/login',
  component: Login
}, {
  path: '/ranking',
  component: Ranking,
  // auth: true
}, {
  path: '/users',
  component: Users,
  // auth: true
}, {
  path: '/matches',
  component: Matches,
  // auth: true
}, {
  path: '/theme-test',
  component: ThemeTest
}];
