import * as esbuild from 'esbuild';

let watchPlugin = {
  name: 'Logger',
  setup(build) {
    build.onEnd(result => {
      console.log(`Blocks rebuilt`)
    })
  },
}

export async function build(config, action = 'build') {

  if (action === 'watch') {
    let ctx = await esbuild.context(Object.assign({}, config, {plugins: [watchPlugin]}));
    console.log('Watching for changes');
    await ctx.watch();
  }
  else if (action === 'build') {
    console.log('Building blocks');
    await esbuild.build(config);
  }
}



