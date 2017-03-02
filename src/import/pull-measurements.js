// @flow

import fetch from 'isomorphic-fetch';

const getDecimalInches = (text: string) => {
  const components = text.split(' ');
  let inches = Number(components[0]);
  if (components.length > 1) {
    const fractionComponents = components[1].split('/');
    const numerator = Number(fractionComponents[0]);
    const denomenator = Number(fractionComponents[1]);
    inches += (numerator / denomenator);
  }
  return inches;
};

const pullMeasurements = async (nflId: number) => {
  let playerPageText: string =
    await (await fetch(`http://www.nfl.com/combine/profiles?id=${nflId}`)).text();

  /*  <ul id="player-profile">
    <li class="height"><span><em>6'3"</em> Height</span></li>
    <li class="arm-length"><span><em>33 3/4"</em> Arm Length</span></li>
    <li class="weight"><span><em>323LBS.</em> Weight</span></li>
    <li class="hands"><span><em>10 3/8"</em> Hands</span></li>
  </ul> */

  playerPageText = playerPageText.substr(playerPageText.indexOf('player-profile"') + 1);

  const items = playerPageText.split('</em>');
  if (items.length < 5) {
    console.log(`Invalid measurements: ${playerPageText}`);
    return null;
  }

  const heightText = items[0].substr(items[0].indexOf('<em>') + 4);
  const armLengthText = items[1].substr(items[1].indexOf('<em>') + 4);
  const weightText = items[2].substr(items[2].indexOf('<em>') + 4);
  const handSizeText = items[3].substr(items[3].indexOf('<em>') + 4);

  const heightComponents = heightText.split('\'');
  const heightFeet = Number(heightComponents[0]);
  const heightInches = Number(heightComponents[1].replace('"', ''));

  const height = (heightFeet * 12) + heightInches;
  const weight = Number(weightText.replace('LBS.', ''));
  const armLength = getDecimalInches(armLengthText.replace('"', ''));
  const handSize = getDecimalInches(handSizeText.replace('"', ''));

  return {
    height,
    weight,
    armLength,
    handSize,
  };
};

export default pullMeasurements;
