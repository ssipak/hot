import ts, { ScriptTarget, SyntaxKind } from 'typescript';
import path from 'path';

export function fixDtsImportsPlugin (paths) {
  const resolveFn = prepareResolveFn(paths);

  // noinspection JSUnusedGlobalSymbols
  return {
    name: 'fix-dts-plugin',
    generateBundle (options, bundle) {
      Object
        .keys(bundle)
        .filter(x => /\.d\.ts$/.test(x))
        .map(x => bundle[x])
        .filter(x => x.type === 'asset')
        .forEach(process.bind(this)(resolveFn));
    }
  };
}

function prepareResolveFn (paths) {
  const SEP = escapeRegExp(path.sep);

  const subFn = Object.entries(paths)
    .map(([from, to]) => {
      const pattern = `^${escapeRegExp(from)}(?=${SEP}|$)`;
      const regex = new RegExp(pattern);
      return (str) => str.replace(regex, to);
    })
    .reduce((acc, fn) => (str) => fn(acc(str)));

  return (currentFilename, importedFilename) => {
    const substitutedFilename = subFn(importedFilename);
    if (substitutedFilename === importedFilename) {
      return importedFilename;
    }

    let relDir = path.relative(path.dirname(currentFilename), path.dirname(substitutedFilename));

    if (!path.isAbsolute(relDir) && relDir.startsWith('.') === false) {
      relDir = `.${path.sep}${relDir}`;
    }

    return path.format({ dir: relDir, base: path.basename(substitutedFilename) });
  };
}

function process (resolveFn) {
  return (asset) => {
    const file = ts.createSourceFile(asset.fileName, asset.source, ScriptTarget.Latest);

    file.forEachChild(node => {
      if (node.kind !== SyntaxKind.ImportDeclaration) {
        return;
      }

      const { moduleSpecifier } = node;

      if (moduleSpecifier.kind !== SyntaxKind.StringLiteral) {
        console.warn('Module specifier is not a string literal');
        return;
      }

      moduleSpecifier.text = resolveFn(asset.fileName, moduleSpecifier.text);
    });

    asset.source = ts.createPrinter().printFile(file);
  };
}

function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
