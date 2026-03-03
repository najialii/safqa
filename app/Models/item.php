<?php

namespace App\Models;
use Illuminate\Database\Elequent\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class item extends Model
{


   use HasUuid;

protected $fillable = [
    'name',
    'description',
    'price',
    'quantity',
    'category_id',
    'status'
];

public function category()
{
    return $this->belongsTo(cat::class);

}

public function safqa()
{
    return $this->hasOne(safqa::class);   
}


}