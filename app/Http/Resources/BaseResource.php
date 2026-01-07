<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    public static function apiPaginate($query, $request)
    {
       $pageSize = 5;
       
       if(($pageSizeInput = (int) $request->page_size) > 0) {
           $pageSize = min($pageSizeInput, 10);
       }    

       return static::collection($query->paginate($pageSize)->appends($request->query()))
        ->response()
        ->getData();
    }
}
