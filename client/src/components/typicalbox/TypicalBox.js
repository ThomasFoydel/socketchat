import React from 'react';
import Typical from 'react-typical';
import './TypicalBox.scss';

const TypicalBox = () => {
  return (
    <div className='typicalbox-outercontainer'>
      <div className='typicalbox-container'>
        <Typical
          steps={[
            '',
            300,
            'He̜l̯̩͍l͢o̳̲̘.̧͔̪̪̩',
            1000,
            'Welco̞m̦͓e t̤͕o c͢h̳͍͈͉͎a̭̥̰̹̥ṱ̢̗̭ͅ.̧͔̪̪̩',
            1000,
            '',
            300,
            'Choose̮ a̡͖ t͍̼o͇p̜̥i̹̼c͕̙.̧̲.̧̲.̧̲',
            4500
          ]}
          loop={Infinity}
          wrapper='b'
        />
      </div>
    </div>
  );
};

export default TypicalBox;
