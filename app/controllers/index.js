if (!Ti.App.Properties.getBool('initialActivation')) {
  Alloy.createModel('photoRecord', {
    name: '作物1',
    photo: '/images/tree_dead.png',
    date: '2016-10-10 12:34:56',
    work: '観察',
    note: '作物1の様子を観察をした。葉っぱは枯れ、冬の季節を迎える。今年は収穫量が少なかったので、来年は今年よりも収穫量を増やせるように対策をしっかり練りたい。'
  }).save();

  Alloy.createModel('photoRecord', {
    name: '作物1',
    photo: '/images/tree.png',
    date: '2017-05-01 12:34:56',
    work: '観察',
    note: '作物2の成長を観察した。前回の記録した日から時間がかなり経過したが、一段と実の色が鮮やかになった。'
  }).save();

  Alloy.createModel('crop', {
    name: 'りんご'
  }).save();

  Alloy.createModel('work', {
    name: '摘果',
    cropId: 1
  });

  Ti.App.Properties.setObject('recordProperties', {
    name: 'りんご',
    work: '摘果',
    cropId: 1
  });
  Ti.App.Properties.setBool('initialActivation', true);
}

Alloy.createController('tab').getView().open({modal: true});
