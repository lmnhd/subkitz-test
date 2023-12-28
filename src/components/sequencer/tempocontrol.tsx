import React, { useState } from 'react'

export default function TempoControl({tempoChanged,startingTempo}:{tempoChanged:any, startingTempo:number}) {
    const [tempo, setTempo] = useState<number>(startingTempo);
const updateTempo = (e:any) => {
    setTempo(e.target.value);
    console.log('tempo', e.target.value);
    tempoChanged(e.target.value);
}
const incrementTempo = (upordown:string) => {
    if(upordown == 'up'){
        setTempo(tempo + 1);
        tempoChanged(tempo + 1);
    }else{
        setTempo(tempo - 1);
        tempoChanged(tempo - 1);
    }
}

  return (
    <div className='flex flex-col gap-1 w-20'>
        <button className='bg-red-900' onClick={() => incrementTempo('up')}>+</button>
        <input type="number" title="tempo" value={tempo} min={50} max={240}
    onInput={updateTempo} className='text-xl text-black align-middle text-center bg-lime-500 rounded-lg' />
        <button className='bg-red-900' onClick={() => incrementTempo('down')}>-</button>
    </div>
  )
}
