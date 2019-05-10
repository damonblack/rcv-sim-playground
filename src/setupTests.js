import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

module.exports = {
  setupFilesAfterEnv: ['<rootDir>src/setupTests.js'],
};
