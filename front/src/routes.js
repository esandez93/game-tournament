import {
  Home,
  Login,
  Matches,
  Ranking,
  ThemeTest
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
  path: '/matches',
  component: Matches
}, {
  path: '/theme-test',
  component: ThemeTest
}];
