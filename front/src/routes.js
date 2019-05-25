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
  component: Home
}, {
  path: '/login',
  component: Login
}, {
  path: '/ranking',
  component: Ranking
}, {
  path: '/users',
  component: Users
}, {
  path: '/matches',
  component: Matches
}, {
  path: '/theme-test',
  component: ThemeTest
}];
