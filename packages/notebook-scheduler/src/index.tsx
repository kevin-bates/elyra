/*
 * Copyright 2018-2019 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {ILayoutRestorer, JupyterFrontEnd, JupyterFrontEndPlugin} from '@jupyterlab/application';
import {ICommandPalette, WidgetTracker} from "@jupyterlab/apputils";
import {JSONExt} from "@phosphor/coreutils";
import {Widget} from "@phosphor/widgets";

import {SubmitNotebookButtonExtension} from "./SubmitNotebook";
import {NotebookExperimentWidget} from "./NotebookExperiments";

import '../style/index.css';
/**
 * A JupyterLab extension to submit notebooks to
 * be executed in a remote platform
 */

export const ewai_extension: JupyterFrontEndPlugin<void> = {
  id: 'ewai-extension',
  requires: [ICommandPalette, ILayoutRestorer],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    restorer: ILayoutRestorer
  ): void => {
    console.log('AI Workspace - notebook-scheduler extension is activated!');

    // Extension initialization code
    let buttonExtension = new SubmitNotebookButtonExtension(app);
    app.docRegistry.addWidgetExtension('Notebook', buttonExtension);
    app.contextMenu.addItem({
      selector: '.jp-Notebook',
      command: 'notebook:submit',
      rank: -0.5
    });

    // Declare a widget variable
    let notebookExperimentWidget: NotebookExperimentWidget

    setInterval(() => {
      if(notebookExperimentWidget) {
        console.log('>>> timer expired... will refresh experiment list')
        notebookExperimentWidget.update()
      }
    }, 10 * 1000);

    // Add an application command
    const command: string = 'ewai:open-experiments';
    app.commands.addCommand(command, {
    label: 'Notebook Experiments',
    execute: () => {
      if (!notebookExperimentWidget) {
        // Create a new widget if one does not exist
        notebookExperimentWidget = new NotebookExperimentWidget();
        notebookExperimentWidget.update();
      }
      if (!tracker.has(notebookExperimentWidget)) {
        // Track the state of the widget for later restoration
        tracker.add(notebookExperimentWidget);
      }
      if (!notebookExperimentWidget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(notebookExperimentWidget,'main');
      } else {
        // Refresh the comic in the widget
        notebookExperimentWidget.update();
      }

      // Add as right side panel
      app.shell.add(notebookExperimentWidget,'right')

      // Activate the widget
      app.shell.activateById(notebookExperimentWidget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Deep Learning Workspace' });


  // Track and restore the widget state
  let tracker = new WidgetTracker<Widget>({ namespace: 'ewai' });
  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => 'ewai'
  });
  }
};

export default ewai_extension;
