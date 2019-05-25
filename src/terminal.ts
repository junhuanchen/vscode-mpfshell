import * as vscode from 'vscode';

let term: any | undefined;

function get_Path() {

    let editor = vscode.window.activeTextEditor;

    if (editor !== undefined && editor.document.uri.scheme === 'file') {

        // console.log(editor.document);

        return editor.document.uri.fsPath;
    }

    return "";
}

export default class Terminal {

    constructor() {

    }

    async set_open() {

        let serial: string | undefined = "";
        let Folders: vscode.WorkspaceFolder | undefined;

        if (vscode.workspace.workspaceFolders) {

            // console.log(vscode.workspace.workspaceFolders);

            if (vscode.workspace.workspaceFolders.length > 1) {

                Folders = await vscode.window.showWorkspaceFolderPick({ placeHolder: 'Pick Workspace Folder to which this setting should be applied' });
            } else {
                Folders = vscode.workspace.workspaceFolders[0];
            }

            serial = await vscode.window.showInputBox({ value:'COM', placeHolder: 'Input your open args for mpfshell.' });

            if (serial === undefined) {
                serial = "";
            }

            if (Folders !== undefined) {
                await vscode.workspace.getConfiguration('', Folders.uri).update('mpfshell.open', serial, vscode.ConfigurationTarget.WorkspaceFolder);
            }

        } else {

            // 无工作区场合

            serial = await vscode.window.showInputBox({ value:'COM', placeHolder: 'Input your open args for mpfshell.' });
            if (serial === undefined) {
                serial = "";
            }
            await vscode.workspace.getConfiguration().update('mpfshell.open', serial, vscode.ConfigurationTarget.Global);
        }

        console.log('your serial: ', serial);
    }

    async get_open() {
        let serial: string | undefined = "";
        let Folders: vscode.WorkspaceFolder | undefined;

        if (vscode.workspace.workspaceFolders) {

            // console.log(vscode.workspace.workspaceFolders);

            if (vscode.workspace.workspaceFolders.length > 1) {

                // let editor = vscode.window.activeTextEditor;

                // if(editor !== undefined) {
                //     let folders = vscode.workspace.workspaceFolders.map(folder => {
                //         let editor = vscode.window.activeTextEditor;
                //         if(editor !== undefined) {
                //             let result = editor.document.fileName.includes(folder.name);
                //             if (result) {
                //                 return folder;
                //             }
                //         }
                //         return undefined;
                //     });

                //     console.log(editor.document);

                //     if (folders){
                //         Folders = folders[0];
                //     }

                // }

                // if (Folders) {

                //     Folders = await vscode.window.showWorkspaceFolderPick({ placeHolder: 'Pick Workspace Folder to which this setting should be applied' });
                // }

                Folders = await vscode.window.showWorkspaceFolderPick({ placeHolder: 'Pick Workspace Folder to which this setting should be applied' });
            } else {
                Folders = vscode.workspace.workspaceFolders[0];
            }

            // console.log(Folders);

            if (Folders) {
                let config = vscode.workspace.getConfiguration('', Folders.uri);

                // console.log(config.inspect('mpfshell.open'));

                let cfg = config.inspect('mpfshell.open');

                // cfg = config.get('mpfshell.open');

                if (cfg === undefined || cfg.workspaceFolderValue === undefined) {

                    // 不存在配置，重建默认值

                    serial = await vscode.window.showInputBox({ value:'COM', placeHolder: 'Input your open args for mpfshell.' });

                    if (serial === undefined) {
                        serial = "";
                    }

                    await config.update('mpfshell.open', serial, vscode.ConfigurationTarget.WorkspaceFolder);

                } else {
                    serial = <string>cfg.workspaceFolderValue;
                }

            }

        } else {

            // 无工作区场合

            let config = vscode.workspace.getConfiguration();

            serial = config.get('mpfshell.open');

            if (serial === '') {
                serial = await vscode.window.showInputBox({ value:'COM', placeHolder: 'Input your open args for mpfshell.' });
                if (serial === undefined) {
                    serial = "";
                }
                await config.update('mpfshell.open', serial, vscode.ConfigurationTarget.Global);
            }

        }

        console.log('your serial: ', serial);

        return serial;
    }

    runfile(): void {

        try {
            this.get_open().then(serial => {

                let path = get_Path();

                let tmp = path.split('\\');
                let fileName = tmp[tmp.length - 1];

                console.log(serial, path, fileName);

                let shell = "mpfs -n --nohelp -c 'open " + serial + "; lcd " + path.replace(fileName, '') + "; runfile " + fileName + ";'";

                if (term !== undefined) {
                    term.dispose();
                }

                term = (<any>vscode.window).createTerminal('mpfshell');

                console.log(shell);

                term.sendText(shell);
                term.show();

            });

        } catch (error) {
            console.log(error);
        }

    }

    tools(): void {

        try {

            let shell = "mpfs";

            if (term !== undefined) {
                term.dispose();
            }

            term = (<any>vscode.window).createTerminal('mpfshell');

            console.log(shell);

            term.sendText(shell);
            term.show();

        } catch (error) {
            console.log(error);
        }

    }

    repl(): void {

        try {
            this.get_open().then(serial => {

                let shell = "mpfs -n --nohelp -c 'open " + serial + "; repl ;'";

                if (term !== undefined) {
                    term.dispose();
                }

                term = (<any>vscode.window).createTerminal('mpfshell');

                console.log(shell);

                term.sendText(shell);
                term.show();

            });

        } catch (error) {
            console.log(error);
        }

    }

}