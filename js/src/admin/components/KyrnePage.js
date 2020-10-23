import Page from 'flarum/components/Page';
import LoadingModal from 'flarum/components/LoadingModal';
import icon from 'flarum/helpers/icon';

export default class KyrnePage extends Page {
  view() {
    return (
      <div className="KyrnePage">

        <div className="KyrnePage-list">
          <div className="container">
            <ul className="KyrneList">
              {Object.keys(app.data.extensions).map((id) => {
                const extension = app.data.extensions[id];

                if (!id.includes('kyrne')) return;

                return (
                  <li>
                    <div class="grid-7 element-animation">
                      <div class="card color-card">
                        {extension.icon ? icon(extension.icon) : <div style={"background:" + extension.extra['flarum-extension'].image + 'background-position:center;height:90px;width:90px;background-size:90px;display:block;margin:0 auto;margin-top:50px;margin-bottom:-15px;'}></div>}
                          <h1 class="title">{extension.extra['flarum-extension'].title}</h1>
                          <p class="version">{extension.version}</p>
                          <div class="desc top">
                            <p>{extension.description}</p>
                          </div>
                          <button onclick={this.toggle.bind(this, extension.id)} class={"btn top " + (!this.isEnabled(extension.id) ? 'disabled' : '')} > {!this.isEnabled(extension.id) ? 'Enable' : 'Disable'}</button>

                          <hr class="hr">
                            <div class="container">
                              <div class="content">
                                {(app.extensionSettings[extension.id]) ?
                                <div className="grid-2">
                                  <a onclick={app.extensionSettings[extension.id]}>
                                    <button className="color-b circle"> {icon('fas fa-cog')}</button>
                                    <h2 className="title">Settings</h2>
                                    <p className="location">Configure</p>
                                  </a>
                                </div>
                                  : ''}
                                <div class="grid-2">
                                  <a target="_blank" href={extension.extra['flarum-extension'].info.link}>
                                    <button class="color-c circle"> {icon('fas fa-info-circle')}</button>
                                    <h2 class="title">Info</h2>
                                    <p class="location">{extension.extra['flarum-extension'].info.location}</p>
                                  </a>
                                </div>
                                <div class="grid-2">
                                  <a target="_blank" href={extension.extra['flarum-extension'].extra.link}>
                                    <button class="color-d circle">{icon(extension.extra['flarum-extension'].extra.icon)}</button>
                                    <h2 class="title">{extension.extra['flarum-extension'].extra.title}</h2>
                                    <p class="location">{extension.extra['flarum-extension'].extra.location}</p>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </hr>
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
  }

  isEnabled(name) {
    const enabled = JSON.parse(app.data.settings.extensions_enabled);

    return enabled.indexOf(name) !== -1;
  }

  toggle(id) {
    const enabled = this.isEnabled(id);

    app
      .request({
        url: app.forum.attribute('apiUrl') + '/extensions/' + id,
        method: 'PATCH',
        body: { enabled: !enabled },
      })
      .then(() => {
        if (!enabled) localStorage.setItem('enabledExtension', id);
        window.location.reload();
      });

    app.modal.show(LoadingModal);
  }
}
