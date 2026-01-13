<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->text('detail_desc')->nullable();
            $table->integer('sold_quantity')->default(0);
            $table->integer('stock_quantity')->default(0);
            $table->decimal('price', 15, 2);
            $table->string('origin_id');
            $table->string('category_id');
            $table->string('unit')->nullable();
            $table->text('image')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('short_desc')->nullable();
            $table->timestamps();
            $table->foreign('origin_id')->references('id')->on('origins')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
