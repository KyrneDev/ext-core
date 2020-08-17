import { extend, override } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import Button from 'flarum/components/Button';
import Dropdown from 'flarum/components/Dropdown';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import icon from 'flarum/helpers/icon';
import ExtensionsPage from 'flarum/components/ExtensionsPage';
import AddExtensionModal from 'flarum/components/AddExtensionModal';

import KyrnePage from './components/KyrnePage';

app.initializers.add('kyrne-everygreen', () => {
  app.routes['kyrne'] = { path: '/kyrne', component: KyrnePage.component() };

  extend(AdminNav.prototype, 'items', (items) => {
    items.add(
      'kyrne',
      AdminLinkButton.component({
        href: app.route('kyrne'),
        icon: 'fas fa-space-shuttle',
        children: "Kyrne's Extensions",
        description: "The home for all of Kyrne's extensions",
      })
    );
  });

  override(ExtensionsPage.prototype, 'view', function() {
    return (
      <div className="ExtensionsPage">
        <div className="ExtensionsPage-header">
          <div className="container">
            {Button.component({
              children: app.translator.trans('core.admin.extensions.add_button'),
              icon: 'fas fa-plus',
              className: 'Button Button--primary',
              onclick: () => app.modal.show(AddExtensionModal),
            })}
          </div>
        </div>

        <div className="ExtensionsPage-list">
          <div className="container">
            <ul className="ExtensionList">
              {Object.keys(app.data.extensions).map((id) => {
                const extension = app.data.extensions[id];
                const controls = this.controlItems(extension.id).toArray();

                if (id.includes('kyrne')) return;

                return (
                  <li className={'ExtensionListItem ' + (!this.isEnabled(extension.id) ? 'disabled' : '')}>
                    <div className="ExtensionListItem-content">
                      <span className="ExtensionListItem-icon ExtensionIcon" style={extension.icon}>
                        {extension.icon ? icon(extension.icon.name) : ''}
                      </span>
                      {controls.length ? (
                        <Dropdown
                          className="ExtensionListItem-controls"
                          buttonClassName="Button Button--icon Button--flat"
                          menuClassName="Dropdown-menu--right"
                          icon="fas fa-ellipsis-h"
                        >
                          {controls}
                        </Dropdown>
                      ) : (
                        ''
                      )}
                      <div className="ExtensionListItem-main">
                        <label className="ExtensionListItem-title">
                          <input type="checkbox" checked={this.isEnabled(extension.id)} onclick={this.toggle.bind(this, extension.id)} />{' '}
                          {extension.extra['flarum-extension'].title}
                        </label>
                        <div className="ExtensionListItem-version">{extension.version}</div>
                        <div className="ExtensionListItem-description">{extension.description}</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  })
});

