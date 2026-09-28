import HomeView from '../views/home-view';
import HomePresenter from '../presenters/home-presenter';

import LoginView from '../views/login-view';
import LoginPresenter from '../presenters/login-presenter';

import RegisterView from '../views/register-view';
import RegisterPresenter from '../presenters/register-presenter';

import AddStoryView from '../views/add-story-view';
import AddStoryPresenter from '../presenters/add-story-presenter';

import DetailView from '../views/detail-view';
import DetailPresenter from '../presenters/detail-presenter';

import AboutView from '../views/about-view';
import AboutPresenter from '../presenters/about-presenter';

import SavedView from '../views/saved-view';
import SavedPresenter from '../presenters/saved-presenter';

const routes = {
  '/': {
    view: HomeView,
    presenter: HomePresenter,
    needAuth: true,
  },
  '/saved': {
    view: SavedView,
    presenter: SavedPresenter,
    needAuth: false,
  },
  '/login': {
    view: LoginView,
    presenter: LoginPresenter,
    onlyGuest: true,
  },
  '/register': {
    view: RegisterView,
    presenter: RegisterPresenter,
    onlyGuest: true,
  },
  '/add-story': {
    view: AddStoryView,
    presenter: AddStoryPresenter,
    needAuth: true,
  },
  '/detail/:id': {
    view: DetailView,
    presenter: DetailPresenter,
    needAuth: true,
  },
  '/about': {
    view: AboutView,
    presenter: AboutPresenter,
    needAuth: false,
  },
};

export default routes;
